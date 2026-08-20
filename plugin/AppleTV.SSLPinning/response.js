/**
 * Apple TV SSL Pinning Workaround
 * Derived from NSRingo/TV v3.4.4 isWorkaroundSSLPinning (Apache-2.0)
 *
 * 只改 uts-api JSON 里的 hlsUrl 主机名：
 *   play.itunes.apple.com      -> play-cdn.itunes.apple.com
 *   play-edge.itunes.apple.com -> play-edge-cdn.itunes.apple.com
 *
 * App 去连未证书固定的别名，Loon 才能 MitM，DualSubs 才能改字幕。
 * FairPlay / FPS 许可证地址不改，避免破坏 DRM。
 */
function rewriteHlsUrl(url) {
	if (typeof url !== "string" || url.length === 0) return url;
	// play-edge 不会误伤 play-edge-cdn，因为匹配的是完整主机名片段
	return url
		.replace("://play.itunes.apple.com", "://play-cdn.itunes.apple.com")
		.replace("://play-edge.itunes.apple.com", "://play-edge-cdn.itunes.apple.com");
}

function walk(node) {
	if (!node || typeof node !== "object") return;
	if (Array.isArray(node)) {
		for (const item of node) walk(item);
		return;
	}
	if (typeof node.hlsUrl === "string") {
		node.hlsUrl = rewriteHlsUrl(node.hlsUrl);
	}
	for (const key of Object.keys(node)) walk(node[key]);
}

function passThrough() {
	$done({});
}

function main() {
	const raw = $response.body;
	if (raw == null || raw === "") {
		passThrough();
		return;
	}

	const contentType = String(
		$response.headers?.["Content-Type"] ?? $response.headers?.["content-type"] ?? ""
	).split(";")[0].trim();

	// 非 JSON 直接放行，避免误伤 protobuf
	if (contentType && contentType !== "application/json" && contentType !== "text/json") {
		passThrough();
		return;
	}

	try {
		const body = typeof raw === "string" ? JSON.parse(raw) : raw;
		walk(body);
		$done({ body: JSON.stringify(body) });
	} catch (error) {
		console.log("[AppleTV SSLPinning] " + error);
		passThrough();
	}
}

main();

# DualSubs Spotify 外部优先

基于 [DualSubs/Spotify](https://github.com/DualSubs/Spotify) `v1.9.12` 的请求阶段定制。

只改一件事：默认先用外部源歌词（网易云）；外部源没有原文时，再回退 Spotify 官方歌词，用翻译器做成双语。

Translate / External 的展示脚本仍用官方 [DualSubs Universal](https://github.com/DualSubs/Universal)，不改依赖。

## 文件

| 文件 | 说明 |
| --- | --- |
| `DualSubs.Spotify.plugin` | Loon 插件（推荐订阅这个） |
| `DualSubs.Spotify.request.bundle.js` | 请求阶段选路脚本，必须和插件放在同一目录 |

## 上传 GitHub 后怎么用

Loon → 插件 → 添加，粘贴这个 raw 地址：

```text
https://raw.githubusercontent.com/Javnie/loon-hub/main/plugin/DualSubs.Spotify/DualSubs.Spotify.plugin
```

然后打开 MitM、重写、脚本，安装并信任 Loon 证书。

本仓库的 `script-path` 已经写成完整 HTTPS 地址。如果复制到其他仓库后 Loon 提示找不到脚本，把两处 request 的 `script-path` 改成新仓库里 `DualSubs.Spotify.request.bundle.js` 的 raw 完整 URL。

## 默认逻辑

```text
外部源有原文歌词 -> subtype=External
无外部原文 + 官方歌词 200 -> subtype=Translate
官方没有，且探测失败/未完成 -> External（保留原版 404 补全）
```

- Spotify App：有歌词时，点歌词面板右上角翻译按钮显示双语
- Spotify Web：有歌词时，直接显示两行双语
- 外部源默认：网易云音乐

## 许可

逻辑基于 DualSubs/Spotify，遵循其 [Apache License 2.0](https://github.com/DualSubs/Spotify/blob/main/LICENSE)。

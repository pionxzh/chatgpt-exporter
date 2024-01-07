# Changelog

## [2.19.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.18.1...userscript-v2.19.0) (2024-01-07)


### Features

* support "archive conversation" in Export Conversations dialog ([706cef2](https://github.com/pionxzh/chatgpt-exporter/commit/706cef2b5a45a0fa5fe853d0cc889502f60027a0)), closes [#199](https://github.com/pionxzh/chatgpt-exporter/issues/199)


### Bug Fixes

* fix conversation started detection ([c5bbb82](https://github.com/pionxzh/chatgpt-exporter/commit/c5bbb82f2861294c9f2f6cd56da18c0fa20728a6))
* fix upload button style ([2960a92](https://github.com/pionxzh/chatgpt-exporter/commit/2960a92ae47eab5b88b05be19223b98ea32ca3e6))
* **i18n:** improve minor issues in translation ([e35bb3a](https://github.com/pionxzh/chatgpt-exporter/commit/e35bb3aed92f03cde20a561d829be5a9b47060f7))
* support pandoar-next ([2d8a6ce](https://github.com/pionxzh/chatgpt-exporter/commit/2d8a6ce5c1d3988af709b2ca59efb08305cbb3a3)), closes [#194](https://github.com/pionxzh/chatgpt-exporter/issues/194)

## [2.18.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.18.0...userscript-v2.18.1) (2023-12-24)


### Bug Fixes

* build conversation list with bottom-up method ([#193](https://github.com/pionxzh/chatgpt-exporter/issues/193)) ([dc157f7](https://github.com/pionxzh/chatgpt-exporter/commit/dc157f7dc29af6b5eded46287bf75e219197f694))
* fix broken timestamp ([613247f](https://github.com/pionxzh/chatgpt-exporter/commit/613247f2a914fc4c1f6459d8e922b09d5b2c57ef))
* fix screenshot export ([b65515c](https://github.com/pionxzh/chatgpt-exporter/commit/b65515c899aee813560ad76c016dcd2dfb366ed5))
* gizmo mode is now the detaul mode ([7d83072](https://github.com/pionxzh/chatgpt-exporter/commit/7d830723dba87e46b278831aad16acce72c418e5))
* port continuation merging back and remove conversation choice ([b1ff972](https://github.com/pionxzh/chatgpt-exporter/commit/b1ff97235d41204937c12b28cb59d50387ee9984))
* remove localstorage legacy migrator ([00ad390](https://github.com/pionxzh/chatgpt-exporter/commit/00ad3902f2044dfe05a918a3671f81abe6e35cd3))
* remove unsplash related workarounds ([ba6f2f7](https://github.com/pionxzh/chatgpt-exporter/commit/ba6f2f7e57bb0c7b73a39e401a9343f954da978e))

## [2.18.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.17.2...userscript-v2.18.0) (2023-11-22)


### Features

* support image in execution output ([38c65b9](https://github.com/pionxzh/chatgpt-exporter/commit/38c65b910db0ef8c38e1465df1e643cccbfad4bb)), closes [#191](https://github.com/pionxzh/chatgpt-exporter/issues/191)


### Bug Fixes

* should not output \[image] ([5478d65](https://github.com/pionxzh/chatgpt-exporter/commit/5478d6586cb143aa03548aedff375177ced614e7))

## [2.17.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.17.1...userscript-v2.17.2) (2023-11-14)


### Bug Fixes

* fix conversation choice selector ([355e07d](https://github.com/pionxzh/chatgpt-exporter/commit/355e07d4efe8b7b3dc597ca1576d65874f7a8734))

## [2.17.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.17.0...userscript-v2.17.1) (2023-11-12)


### Bug Fixes

* fix screenshot and conversation choice ([4bb56f8](https://github.com/pionxzh/chatgpt-exporter/commit/4bb56f8fc2adab3c62c6ef25a8022fc5cb0b76a4))
* replace latex annotation `\[ \] \( \)` with $ for better compatibility ([6e72297](https://github.com/pionxzh/chatgpt-exporter/commit/6e72297a065722947eae2afd6635ac27a1c95abb)), closes [#187](https://github.com/pionxzh/chatgpt-exporter/issues/187)

## [2.17.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.16.1...userscript-v2.17.0) (2023-11-08)


### Features

* support running on gizmo page ([#182](https://github.com/pionxzh/chatgpt-exporter/issues/182)) ([d278210](https://github.com/pionxzh/chatgpt-exporter/commit/d27821027863f7efaf7ef1e4bb4e2f765d57252a))


### Bug Fixes

* support extract id from gizmo path ([0bf3115](https://github.com/pionxzh/chatgpt-exporter/commit/0bf3115948d85e2a639f269d6ca01b71c4fb853e))

## [2.16.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.16.0...userscript-v2.16.1) (2023-11-07)


### Bug Fixes

* messages from tool shouldn't use conversation choice ([aff5ce1](https://github.com/pionxzh/chatgpt-exporter/commit/aff5ce18fe309e3eff2f0eb3ebdee1818745db79)), closes [#173](https://github.com/pionxzh/chatgpt-exporter/issues/173)

## [2.16.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.15.0...userscript-v2.16.0) (2023-11-05)


### Features

* support multi-modal ([#179](https://github.com/pionxzh/chatgpt-exporter/issues/179)) ([c5ed341](https://github.com/pionxzh/chatgpt-exporter/commit/c5ed3413d52a1122775fdc2fc872c719c651d2a2))


### Bug Fixes

* do not render export dialog until needed ([#178](https://github.com/pionxzh/chatgpt-exporter/issues/178)) ([1e7f0fa](https://github.com/pionxzh/chatgpt-exporter/commit/1e7f0fa0b56963272969a72904d2ce9760e785ef))
* show `[image]` for multi-modal in text export ([ddfbee7](https://github.com/pionxzh/chatgpt-exporter/commit/ddfbee7ae632085f765e1bf8996136bd660132ed))

## [2.15.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.5...userscript-v2.15.0) (2023-10-16)


### Features

* partially support `multimodal_text` ([7d5c7de](https://github.com/pionxzh/chatgpt-exporter/commit/7d5c7de30b7b9f7f9ec88fb1fb45f52e7b3b3a69))
* support footnote ([35d74e0](https://github.com/pionxzh/chatgpt-exporter/commit/35d74e0f9e02cd81a2a705bed47cafc26243c98f))


### Bug Fixes

* conversationChoices should only applied to node with recipient all ([bd36162](https://github.com/pionxzh/chatgpt-exporter/commit/bd3616282ea570e31d2a91f801aeec45d9699dab))
* should not output response from plugins ([8d4ee37](https://github.com/pionxzh/chatgpt-exporter/commit/8d4ee3752a240e8252a68d06d8b0144fcbdf13c1))

## [2.14.5](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.4...userscript-v2.14.5) (2023-09-25)


### Bug Fixes

* further improve the code and execution result's output format ([49cfd6e](https://github.com/pionxzh/chatgpt-exporter/commit/49cfd6e2b036240bafd690bc49fd7ac233515b39))
* handle canvas size might exceed browser's limit ([3e6629d](https://github.com/pionxzh/chatgpt-exporter/commit/3e6629d2b5117f8471eb1ba30f6a5337e477f993))
* handle frozen page props ([75b5f9d](https://github.com/pionxzh/chatgpt-exporter/commit/75b5f9d51a9e5c4de74e5ce51b891d56f86c5878))
* support message content type `execution_output` from plugin ([78e4ecf](https://github.com/pionxzh/chatgpt-exporter/commit/78e4ecfd5d8ec16e52abf10208f868c74d44e234))

## [2.14.4](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.3...userscript-v2.14.4) (2023-09-19)


### Bug Fixes

* fix popup position on mobile (esp sharing page) ([3b39746](https://github.com/pionxzh/chatgpt-exporter/commit/3b397468e17683c09aa312b12504d66654f33f9f))

## [2.14.3](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.2...userscript-v2.14.3) (2023-08-29)


### Bug Fixes

* zIndex should not overlap on setting menu ([39d13da](https://github.com/pionxzh/chatgpt-exporter/commit/39d13da3465bdf4cc0b14344fcd345f063ecbb4a)), closes [#166](https://github.com/pionxzh/chatgpt-exporter/issues/166)

## [2.14.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.1...userscript-v2.14.2) (2023-08-21)


### Bug Fixes

* z-index collision with history list ([c1faca9](https://github.com/pionxzh/chatgpt-exporter/commit/c1faca9dee9efea4d8d23e38add1cc85236ea4a3)), closes [#164](https://github.com/pionxzh/chatgpt-exporter/issues/164)

## [2.14.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.14.0...userscript-v2.14.1) (2023-08-20)


### Bug Fixes

* toggle should not shrink on small screen ([b152f44](https://github.com/pionxzh/chatgpt-exporter/commit/b152f4493927fbaebe47327dc347e76c18ca1d61))

## [2.14.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.13.0...userscript-v2.14.0) (2023-08-20)


### Features

* support OpenAI official JSON format ([66d8f90](https://github.com/pionxzh/chatgpt-exporter/commit/66d8f90cb22ff46e45ccd18c17ed3dd269244d46)), closes [#162](https://github.com/pionxzh/chatgpt-exporter/issues/162)


### Bug Fixes

* adopt latest sentinel-js, no more patch ([631332d](https://github.com/pionxzh/chatgpt-exporter/commit/631332dac23406189ce44929fc1aec9c4b273e67))

## [2.13.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.12.1...userscript-v2.13.0) (2023-07-09)


### Features

* support conversation timestamp in markdown export ([38f4a97](https://github.com/pionxzh/chatgpt-exporter/commit/38f4a97a9d1d7ab32190f1100a370429baf4b34e)), closes [#155](https://github.com/pionxzh/chatgpt-exporter/issues/155)

## [2.12.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.12.0...userscript-v2.12.1) (2023-06-15)


### Bug Fixes

* fix checkbox style ([e1b41c9](https://github.com/pionxzh/chatgpt-exporter/commit/e1b41c9cd73333f1123049a4d5d3e1c359cf0f9c))
* update zhile.io API to fakegpt ([2723554](https://github.com/pionxzh/chatgpt-exporter/commit/27235544637e4fb8835b6958b8dc7d7bee70a2da))

## [2.12.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.11.0...userscript-v2.12.0) (2023-06-08)


### Features

* added support for create_time and update_time metadata parameters per [#94](https://github.com/pionxzh/chatgpt-exporter/issues/94) ([#114](https://github.com/pionxzh/chatgpt-exporter/issues/114)) ([5df4ba6](https://github.com/pionxzh/chatgpt-exporter/commit/5df4ba6050292db1f88a12a77dcd1f46eeccba55))
* support sharing page ([50462cd](https://github.com/pionxzh/chatgpt-exporter/commit/50462cd0ba9adea279b5b16c7445a6214424d2d1)), closes [#147](https://github.com/pionxzh/chatgpt-exporter/issues/147)

## [2.11.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.10.0...userscript-v2.11.0) (2023-05-30)


### Features

* concat the output of official "Continue generating" ([b191ec2](https://github.com/pionxzh/chatgpt-exporter/commit/b191ec25cc33cd7ff1dc96ef65d1f8fe60d74cfb)), closes [#146](https://github.com/pionxzh/chatgpt-exporter/issues/146)

## [2.10.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.9.2...userscript-v2.10.0) (2023-05-08)


### Features

* support `chat.zhile.io` ([4331bd8](https://github.com/pionxzh/chatgpt-exporter/commit/4331bd8f936b935ae47839a56e989481ca97f13f)), closes [#143](https://github.com/pionxzh/chatgpt-exporter/issues/143)
* support exporting from official export ([ac59789](https://github.com/pionxzh/chatgpt-exporter/commit/ac59789f508433675bfd9a492e6887035c588067)), closes [#121](https://github.com/pionxzh/chatgpt-exporter/issues/121)


### Bug Fixes

* **i18n:** update `Invalid File Format` in Turkish ([5cbb2e9](https://github.com/pionxzh/chatgpt-exporter/commit/5cbb2e94eebb28797f94322c0e4b0136f8883d89))
* update API interface and detect chat history disabled ([0fcb3d7](https://github.com/pionxzh/chatgpt-exporter/commit/0fcb3d7efe0501736629d9c45695dff6df30e1ae))

## [2.9.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.9.1...userscript-v2.9.2) (2023-05-01)


### Bug Fixes

* export all should enable compression ([ca9d5c5](https://github.com/pionxzh/chatgpt-exporter/commit/ca9d5c512f92bb423aabc3b6ab25befd1d52e591)), closes [#141](https://github.com/pionxzh/chatgpt-exporter/issues/141)

## [2.9.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.9.0...userscript-v2.9.1) (2023-04-24)


### Bug Fixes

* reduce the blurriness of screenshot export ([42a1d75](https://github.com/pionxzh/chatgpt-exporter/commit/42a1d75ca735ff5cf449758425a13a0fba959eb3)), closes [#129](https://github.com/pionxzh/chatgpt-exporter/issues/129)
* remove revison and buttons from screenshot ([ba41b79](https://github.com/pionxzh/chatgpt-exporter/commit/ba41b7951675f87a934f438bc69e343cf8743b07))

## [2.9.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.8.0...userscript-v2.9.0) (2023-04-23)


### Features

* basic support for response from plugin ([c45fdbe](https://github.com/pionxzh/chatgpt-exporter/commit/c45fdbe4a48ec90947d03c2fb3c5ad67e9bff5e6))
* **i18n:** add spanish to lanaguage list ([2b2f75c](https://github.com/pionxzh/chatgpt-exporter/commit/2b2f75ca0579b723beda03e42c8790931cebd6c1))
* **i18n:** add spanish translation ([#137](https://github.com/pionxzh/chatgpt-exporter/issues/137)) ([08a6930](https://github.com/pionxzh/chatgpt-exporter/commit/08a693005e19360c15d2577b914bbdd754adeac4))


### Bug Fixes

* **i18n:** fix Malaysia should use `ZH_Hans` ([9e2b748](https://github.com/pionxzh/chatgpt-exporter/commit/9e2b7485b340430729cea4819b5c345394129c11))
* support url with model ([a50d580](https://github.com/pionxzh/chatgpt-exporter/commit/a50d5802be2656450e25d66df8ad10d696ba5d43))

## [2.8.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.7.1...userscript-v2.8.0) (2023-04-21)


### Features

* remove copy button in chat in favor of the built-in copy button ([66dbaa6](https://github.com/pionxzh/chatgpt-exporter/commit/66dbaa669fe0379b0137b67648716e9782cf087e))


### Bug Fixes

* fix export twice ([38c6be3](https://github.com/pionxzh/chatgpt-exporter/commit/38c6be3a1589d1d6c4245bc8a0d30ed086986f4b))
* layout overlap with menu on mobile ([705afe5](https://github.com/pionxzh/chatgpt-exporter/commit/705afe5bef153fe0f3af53b2eb26633c386d23fe)), closes [#134](https://github.com/pionxzh/chatgpt-exporter/issues/134)

## [2.7.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.7.0...userscript-v2.7.1) (2023-04-20)


### Bug Fixes

* some chats cannot be exported because of missing message parts ([2e7ece8](https://github.com/pionxzh/chatgpt-exporter/commit/2e7ece886ef0c4cc7d6a3d5016ebce8799acb6b1))
* thread might not exist ([d18bf3f](https://github.com/pionxzh/chatgpt-exporter/commit/d18bf3f0620566e86369b6e16e2adeed544f2266))

## [2.7.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.5...userscript-v2.7.0) (2023-04-15)


### Features

* **i18n:** add turkish to language list ([b05776f](https://github.com/pionxzh/chatgpt-exporter/commit/b05776fe4f85bd4c4cca9a80cff808c3be4042b2))
* **i18n:** add turkish translation ([#128](https://github.com/pionxzh/chatgpt-exporter/issues/128)) ([9ad8e0a](https://github.com/pionxzh/chatgpt-exporter/commit/9ad8e0a3c6fa0cfec5ced00b04caaf6f8441c162))
* support i18n ([918ff41](https://github.com/pionxzh/chatgpt-exporter/commit/918ff41dc459d228e0c5e09dead41b1abc1c2f4e)), closes [#91](https://github.com/pionxzh/chatgpt-exporter/issues/91)
* use the same Toggle as ChatGPT's setting ([0f91b56](https://github.com/pionxzh/chatgpt-exporter/commit/0f91b5698bd0e01c9f5d1008062fb48a3e93e7cc))

## [2.6.5](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.4...userscript-v2.6.5) (2023-04-14)


### Bug Fixes

* [@match](https://github.com/match) url should have a tralling `/` at the end ([f0f64d4](https://github.com/pionxzh/chatgpt-exporter/commit/f0f64d49963946bd8aab3a6f213cfa5df980139c))

## [2.6.4](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.3...userscript-v2.6.4) (2023-04-14)


### Bug Fixes

* update chat url to /c/* ([96ec23e](https://github.com/pionxzh/chatgpt-exporter/commit/96ec23e7bd63c8b8e92d5c4e6e7527bb6420f2c3))

## [2.6.3](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.2...userscript-v2.6.3) (2023-04-13)


### Bug Fixes

* add missing css `ml-4` ([f5974d4](https://github.com/pionxzh/chatgpt-exporter/commit/f5974d4bd8bd63c2df18387ac4401d64f4b256ba))
* handling same chat name in export all ([aa513b1](https://github.com/pionxzh/chatgpt-exporter/commit/aa513b1bdde84a12d96d92956501ceec2c270a26)), closes [#117](https://github.com/pionxzh/chatgpt-exporter/issues/117)

## [2.6.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.1...userscript-v2.6.2) (2023-04-12)


### Bug Fixes

* handle `GM_*` function might be `undefined` ([77b52b1](https://github.com/pionxzh/chatgpt-exporter/commit/77b52b12fb52ab05c8ea7c49c65c965c99e6281b)), closes [#112](https://github.com/pionxzh/chatgpt-exporter/issues/112)

## [2.6.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.6.0...userscript-v2.6.1) (2023-04-08)


### Bug Fixes

* fix toggle style in mobile view ([dcd9c97](https://github.com/pionxzh/chatgpt-exporter/commit/dcd9c970adefa6aaea699148b62b49274218e31a))

## [2.6.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.5.4...userscript-v2.6.0) (2023-04-07)


### Features

* add conversation timestamp on page and HTML, revamp setting UI ([531a766](https://github.com/pionxzh/chatgpt-exporter/commit/531a766bc89fde5b141efc80ea090f00380e1b42))
* support delete conversations ([554b26d](https://github.com/pionxzh/chatgpt-exporter/commit/554b26dbe9ca6566a864670dd8c337834f266139)), closes [#85](https://github.com/pionxzh/chatgpt-exporter/issues/85)


### Bug Fixes

* update closeDelay 300ms ([388a3ea](https://github.com/pionxzh/chatgpt-exporter/commit/388a3ea718c6d916b818eb197b641a3930d473ba))

## [2.5.4](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.5.3...userscript-v2.5.4) (2023-04-05)


### Bug Fixes

* add missing {chat_id} in Export All ([c8e52aa](https://github.com/pionxzh/chatgpt-exporter/commit/c8e52aaf0d3678ade1c6da01b8171eb9d666423f)), closes [#106](https://github.com/pionxzh/chatgpt-exporter/issues/106)
* export all is not openable ([ea69a4f](https://github.com/pionxzh/chatgpt-exporter/commit/ea69a4fe65bcd9cdeac8799f553f8cae422a6e3e))

## [2.5.3](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.5.2...userscript-v2.5.3) (2023-04-05)


### Bug Fixes

* fix menu is not working after OpenAI page update ([9632818](https://github.com/pionxzh/chatgpt-exporter/commit/9632818845ad6d92df00c53e91211eb448b33b47))

## [2.5.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.5.1...userscript-v2.5.2) (2023-04-04)


### Bug Fixes

* handling screenshot spacing on MacOS Firefox ([dea099d](https://github.com/pionxzh/chatgpt-exporter/commit/dea099dd21b16d2f766e0e30546ebaac50d4a72b)), closes [#78](https://github.com/pionxzh/chatgpt-exporter/issues/78)
* model bar should be hide correctly ([8b8844b](https://github.com/pionxzh/chatgpt-exporter/commit/8b8844b2d3a5e764f32ec57562eb57537375db07))

## [2.5.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.5.0...userscript-v2.5.1) (2023-04-01)


### Bug Fixes

* storage should not throw error when not found ([3de59f8](https://github.com/pionxzh/chatgpt-exporter/commit/3de59f8aae1e84c96879ebe9660a99be18ce1dbd)), closes [#101](https://github.com/pionxzh/chatgpt-exporter/issues/101)

## [2.5.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.4.1...userscript-v2.5.0) (2023-04-01)


### Features

* add `{chat_id}` to filename varaible ([d27e225](https://github.com/pionxzh/chatgpt-exporter/commit/d27e2258d55261a14c08d1255c131d4463caef2d))
* add `{model}` and `{model_name}` to variable ([057fe9f](https://github.com/pionxzh/chatgpt-exporter/commit/057fe9fcfd0ef8e3e9fe834a976d56b3134b86b3))


### Bug Fixes

* load plugin on page with model query string ([5d64f04](https://github.com/pionxzh/chatgpt-exporter/commit/5d64f045ba9bba28af468b34c40989c5655b4cdc)), closes [#100](https://github.com/pionxzh/chatgpt-exporter/issues/100)

## [2.4.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.4.0...userscript-v2.4.1) (2023-03-29)


### Bug Fixes

* fix close button position in Export Dialog ([2498d55](https://github.com/pionxzh/chatgpt-exporter/commit/2498d55fde57c80d87aec8ac80738ce09d87d511))
* setting dialog should allow scroll when overflow ([cd3340d](https://github.com/pionxzh/chatgpt-exporter/commit/cd3340dabf4fe6907a21e641c3d7a08e8518dcdc))
* user's input should respect line break and be escaped ([46b5369](https://github.com/pionxzh/chatgpt-exporter/commit/46b53692548880abb410af07c31585730fa74666)), closes [#95](https://github.com/pionxzh/chatgpt-exporter/issues/95)

## [2.4.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.3.3...userscript-v2.4.0) (2023-03-27)


### Features

* export metadata ([4b92e53](https://github.com/pionxzh/chatgpt-exporter/commit/4b92e53b106ca49bec67e683ce8bd19280147700))

## [2.3.3](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.3.2...userscript-v2.3.3) (2023-03-25)


### Bug Fixes

* handle rate limiting in export all ([ba739e0](https://github.com/pionxzh/chatgpt-exporter/commit/ba739e017bf4c596a74a9a4db85270c450313b43)), closes [#88](https://github.com/pionxzh/chatgpt-exporter/issues/88)

## [2.3.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.3.1...userscript-v2.3.2) (2023-03-24)


### Bug Fixes

* export all should load all of chats ([770f129](https://github.com/pionxzh/chatgpt-exporter/commit/770f1299818309df46a85593ac5789b167977b72)), closes [#86](https://github.com/pionxzh/chatgpt-exporter/issues/86)

## [2.3.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.3.0...userscript-v2.3.1) (2023-03-21)


### Bug Fixes

* copy button shows in code block incorrectly ([b43dbc8](https://github.com/pionxzh/chatgpt-exporter/commit/b43dbc88727a7d2ba66ac5ce1c4e8f19306819eb)), closes [#83](https://github.com/pionxzh/chatgpt-exporter/issues/83)

## [2.3.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.2.1...userscript-v2.3.0) (2023-03-18)


### Features

* support copy text of single response from ChatGPT ([0a78d2e](https://github.com/pionxzh/chatgpt-exporter/commit/0a78d2e17ae96a9182e289cbb7b9ade465f740b9)), closes [#63](https://github.com/pionxzh/chatgpt-exporter/issues/63)
* support GPT-4 avatar in HTML export ([890f10d](https://github.com/pionxzh/chatgpt-exporter/commit/890f10d56ac0b8df15e6b5bad48f5e56a73c142a)), closes [#81](https://github.com/pionxzh/chatgpt-exporter/issues/81)

## [2.2.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.2.0...userscript-v2.2.1) (2023-03-16)


### Bug Fixes

* jszip is not defined in prod build ([8b57e16](https://github.com/pionxzh/chatgpt-exporter/commit/8b57e164eab9fef1ae8bea1610ff639ece680f37)), closes [#75](https://github.com/pionxzh/chatgpt-exporter/issues/75)

## [2.2.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.1.2...userscript-v2.2.0) (2023-03-15)


### Features

* support JSON export and export All ([ce0d895](https://github.com/pionxzh/chatgpt-exporter/commit/ce0d895bacb269f00f757dbab7a165123ba6a239))


### Bug Fixes

* error handling for avatar fetching ([d8af0ec](https://github.com/pionxzh/chatgpt-exporter/commit/d8af0ecbba3ee6666d5a000853e0779c69bab135)), closes [#73](https://github.com/pionxzh/chatgpt-exporter/issues/73)
* hide GPT-4 model text ([796899e](https://github.com/pionxzh/chatgpt-exporter/commit/796899e0a811044bbbb65031246b26210aed506f))

## [2.1.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.1.0...userscript-v2.1.2) (2023-03-10)


### Bug Fixes

* fix wrong dimensions of user pfp in screenshot export ([ad679cd](https://github.com/pionxzh/chatgpt-exporter/commit/ad679cd107bead80c865eca74efe232673aa200e)), closes [#53](https://github.com/pionxzh/chatgpt-exporter/issues/53)
* improve layout and style ([0c801cb](https://github.com/pionxzh/chatgpt-exporter/commit/0c801cbf26563dfcf858039ea42f3c8065d8ba65))
* reduce bundle size by externalizing and dropping modules ([c59faab](https://github.com/pionxzh/chatgpt-exporter/commit/c59faab9a7c9f5e8bdcc4d5d3c75eb1b2ba03680))
* update API interface (follow what OpenAI updated) ([922cb36](https://github.com/pionxzh/chatgpt-exporter/commit/922cb36018473665f96a073e3e577bb61dc48e1a))
* use title from API in markdown and html export ([1f6f4d7](https://github.com/pionxzh/chatgpt-exporter/commit/1f6f4d7219aa9ec599e3ebc94a6af250112e5293))

## [2.1.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v2.0.0...userscript-v2.1.0) (2023-03-08)


### Features

* show message to user when history api disabeld ([9025934](https://github.com/pionxzh/chatgpt-exporter/commit/9025934ced76b0d0b2c71e3c6247c5d233ccb178))


### Bug Fixes

* error handling on menu onclick ([f0b7c7f](https://github.com/pionxzh/chatgpt-exporter/commit/f0b7c7f7dc365102e4d25ae246fce6afda3ca876))
* get accessToken from unsafeWindow and provide a fallback to session API ([0accd66](https://github.com/pionxzh/chatgpt-exporter/commit/0accd66beb740d1b02b2fda392c7d6c20fe5b8dc))

## [2.0.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.9.1...userscript-v2.0.0) (2023-03-07)


### ⚠ BREAKING CHANGES

* rewrite the plugin with API based data source

### Features

* add loading effect on menu button ([6e5bc12](https://github.com/pionxzh/chatgpt-exporter/commit/6e5bc125bfd239e4e26d18565956bc22cb2cea3a))
* add setting dialog/ support `{date}` in filename ([f219def](https://github.com/pionxzh/chatgpt-exporter/commit/f219deff6462d6c691778fa5251e7afa4c94999d))
* rewrite the plugin with API based data source ([4ecf34a](https://github.com/pionxzh/chatgpt-exporter/commit/4ecf34ab726ec6c38efd213a7a4bfb8b28d67bad))
* show timestamp on each chat post ([e602c7b](https://github.com/pionxzh/chatgpt-exporter/commit/e602c7b73f5b0e6594af0c55de2569c1c572acf7))


### Bug Fixes

* check if conversation started ([a60bedc](https://github.com/pionxzh/chatgpt-exporter/commit/a60bedc6dbb4819f02e9617861c74934e49cb40b))
* handle failed callback ([6739500](https://github.com/pionxzh/chatgpt-exporter/commit/6739500aa55c37bf093d5de18ef9b84e1b58b6f6))
* respect line break and improve text style ([c9e60bc](https://github.com/pionxzh/chatgpt-exporter/commit/c9e60bc613f9cc394a09850196d40d8decdf81bf))

## [1.9.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.9.0...userscript-v1.9.1) (2023-02-27)


### Miscellaneous Chores

* script title and description support chinese ([2147a91](https://github.com/pionxzh/chatgpt-exporter/commit/2147a91740e8dd8b7ebae655cfbbf05ed9b7b93b))

## [1.9.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.8.1...userscript-v1.9.0) (2023-02-27)


### Features

* make title of html align with the conversation title ([88804e0](https://github.com/pionxzh/chatgpt-exporter/commit/88804e0c814cf43f9f85a4dfd7ca1961fbcca466)), closes [#46](https://github.com/pionxzh/chatgpt-exporter/issues/46)
* support image in chat ([8be8add](https://github.com/pionxzh/chatgpt-exporter/commit/8be8add7ddc4c0b1951340cb12f3878adacd0874)), closes [#58](https://github.com/pionxzh/chatgpt-exporter/issues/58)


### Bug Fixes

* hide redundent model bar in screenshot export ([f79f3f6](https://github.com/pionxzh/chatgpt-exporter/commit/f79f3f692f2b0f9d9c431758b413aeddaa0e7d7a))
* improve shrinked avatar in exported html ([f8e09bc](https://github.com/pionxzh/chatgpt-exporter/commit/f8e09bc57fc82db2e3c764ff7b149f50d34e79b2))
* rework metadata appearence in HTML export ([#56](https://github.com/pionxzh/chatgpt-exporter/issues/56)) ([bcf4e9d](https://github.com/pionxzh/chatgpt-exporter/commit/bcf4e9d19eae575e208ca37838b95723ba79f0f4))
* try fix [#53](https://github.com/pionxzh/chatgpt-exporter/issues/53) with specific scale in html2canvas ([fefda82](https://github.com/pionxzh/chatgpt-exporter/commit/fefda8245a8d5f8750ca06ccbda4797d72dccf68))

## [1.8.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.8.0...userscript-v1.8.1) (2023-02-21)


### Bug Fixes

* missing menu on firefox ([c397e8f](https://github.com/pionxzh/chatgpt-exporter/commit/c397e8f755feadd24a3b9609752c16c1b4197e61)), closes [#51](https://github.com/pionxzh/chatgpt-exporter/issues/51)

## [1.8.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.7.2...userscript-v1.8.0) (2023-02-17)


### Features

* support mobile ([d7f7d0a](https://github.com/pionxzh/chatgpt-exporter/commit/d7f7d0adb8ae47b57c5272c22ed9afed0b133ac9)), closes [#45](https://github.com/pionxzh/chatgpt-exporter/issues/45)
* support passing theme to exported html ([c9ad754](https://github.com/pionxzh/chatgpt-exporter/commit/c9ad754bbae981a20c3dcb05345833664f17fe44)), closes [#47](https://github.com/pionxzh/chatgpt-exporter/issues/47)


### Bug Fixes

* fix content parsing inside list ([c09bbcc](https://github.com/pionxzh/chatgpt-exporter/commit/c09bbccadc8e3694aaf7180ca11186341bd9b7d7)), closes [#48](https://github.com/pionxzh/chatgpt-exporter/issues/48)
* unify line break to \n ([cd5e7a4](https://github.com/pionxzh/chatgpt-exporter/commit/cd5e7a4b519f47a0ccce9f9cf94277bcc05399ad)), closes [#49](https://github.com/pionxzh/chatgpt-exporter/issues/49)

## [1.7.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.7.1...userscript-v1.7.2) (2023-02-10)


### Bug Fixes

* fix content parsing and rendering in list ([4fdc916](https://github.com/pionxzh/chatgpt-exporter/commit/4fdc9166ff902c747464612465f443df6705288b)), closes [#43](https://github.com/pionxzh/chatgpt-exporter/issues/43)
* improve the style of list ([1049a77](https://github.com/pionxzh/chatgpt-exporter/commit/1049a7743e22fdedfb46338c4b1c222b204ea934))
* respect `start` attribute on ordered-list ([35ef064](https://github.com/pionxzh/chatgpt-exporter/commit/35ef0645750c722ceaa0cbe9e70f40df7878a752))

## [1.7.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.7.0...userscript-v1.7.1) (2023-01-27)


### Bug Fixes

* tweak file name field styles to look nicer when light theme is active ([cc757de](https://github.com/pionxzh/chatgpt-exporter/commit/cc757de0cc00188f09d539c3a6922eddac600917))

## [1.7.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.6.0...userscript-v1.7.0) (2023-01-14)


### Features

* support heading, quote, bold, italic and separator ([3083135](https://github.com/pionxzh/chatgpt-exporter/commit/3083135ace99509b046024039a3a1b19c0cd8693)), closes [#37](https://github.com/pionxzh/chatgpt-exporter/issues/37)

## [1.6.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.5.0...userscript-v1.6.0) (2023-01-11)


### Features

* support menu injection on mobile view ([90c4001](https://github.com/pionxzh/chatgpt-exporter/commit/90c4001dd50db88456e80d3a479b30b1799da0f1))
* support to customize the filename ([85b64b0](https://github.com/pionxzh/chatgpt-exporter/commit/85b64b07de5db51dd6158cdc5b24abb62d57b876))


### Bug Fixes

* filter out content policy danger ([7881d89](https://github.com/pionxzh/chatgpt-exporter/commit/7881d89c20e9aad46604deecab4f9f72769d1c79)), closes [#33](https://github.com/pionxzh/chatgpt-exporter/issues/33)

## [1.5.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.4.0...userscript-v1.5.0) (2023-01-08)


### Features

* adopt dropdown layout ([92b713b](https://github.com/pionxzh/chatgpt-exporter/commit/92b713ba21ed7663d00ba02ebc6ab7f5995897df)), closes [#31](https://github.com/pionxzh/chatgpt-exporter/issues/31)
* support table parsing and exporting ([dd3bd49](https://github.com/pionxzh/chatgpt-exporter/commit/dd3bd49e9eb06c02ad179272ce39991c8721e861)), closes [#32](https://github.com/pionxzh/chatgpt-exporter/issues/32)


### Bug Fixes

* filter out content policy warning ([15b2e54](https://github.com/pionxzh/chatgpt-exporter/commit/15b2e54d3a433a5f6739d6e6ee4ffa3a4c2d3849)), closes [#33](https://github.com/pionxzh/chatgpt-exporter/issues/33)
* fix missing closing of ordered-list ([1ef646e](https://github.com/pionxzh/chatgpt-exporter/commit/1ef646e442fd8c5f7da9183238ec09f63dd9107b))

## [1.4.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.3.3...userscript-v1.4.0) (2022-12-28)


### Features

* support markdown export ([306ed2b](https://github.com/pionxzh/chatgpt-exporter/commit/306ed2b5edf6635f281707f030b80eb2683d3770))

## [1.3.3](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.3.2...userscript-v1.3.3) (2022-12-22)


### Bug Fixes

* improve menu injection ([b822e5b](https://github.com/pionxzh/chatgpt-exporter/commit/b822e5b9a7ce73ddfd8ec6167c6a78f53c4ae3f4)), closes [#24](https://github.com/pionxzh/chatgpt-exporter/issues/24)

## [1.3.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.3.1...userscript-v1.3.2) (2022-12-21)


### Bug Fixes

* stabilize menu injection ([224a51f](https://github.com/pionxzh/chatgpt-exporter/commit/224a51f79020778d78d116fe0de0221f80d19a2b))

## [1.3.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.3.0...userscript-v1.3.1) (2022-12-17)


### Bug Fixes

* prevent alert on cf-protection page ([d40ac3e](https://github.com/pionxzh/chatgpt-exporter/commit/d40ac3e728394a0ff2723c2e3cf86a1ef51c7cea))

## [1.3.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.2.0...userscript-v1.3.0) (2022-12-17)


### Features

* improve the code block style with hightligh.js ([5101b41](https://github.com/pionxzh/chatgpt-exporter/commit/5101b4159ce0f314afa28772b1fe4f6d02900021))
* support ordered-list and unordered-list ([ce87909](https://github.com/pionxzh/chatgpt-exporter/commit/ce87909e7bc50ee5653b8478e0c96c7688c1332d))
* support syntax highlight for HTML output ([5a1b518](https://github.com/pionxzh/chatgpt-exporter/commit/5a1b51895e529eebbf43bbf83c3d83eb52f12935))


### Bug Fixes

* update menu layout to follow chatgpt layout changes ([aa0abec](https://github.com/pionxzh/chatgpt-exporter/commit/aa0abec06f4ec2c2e3c859e7d569373f5ae9b46c))
* update user input selector to follow chatgpt layout changes ([cbb3483](https://github.com/pionxzh/chatgpt-exporter/commit/cbb348334aba53450a62f4013291145db09360a9))

## [1.2.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.1.2...userscript-v1.2.0) (2022-12-10)


### Features

* fix the unstable menu injection ([8fef5ae](https://github.com/pionxzh/chatgpt-exporter/commit/8fef5ae7cd1466c243cb92e17ebebba46dc2c309))

## [1.1.2](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.1.1...userscript-v1.1.2) (2022-12-07)


### Bug Fixes

* escape text content ([76d4082](https://github.com/pionxzh/chatgpt-exporter/commit/76d408287c8faae57be4a726ca34fdfddf8c537f))
* preserve line break in html requestion ([b6e4baf](https://github.com/pionxzh/chatgpt-exporter/commit/b6e4bafabe6ef5c3e5a4aca0a721a27e7d612450))

## [1.1.1](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.1.0...userscript-v1.1.1) (2022-12-06)


### Bug Fixes

* follow the layout changes on chatgpt side ([5b42412](https://github.com/pionxzh/chatgpt-exporter/commit/5b424128af8442b731833f31d55273e555174f5e))

## [1.1.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.0.0...userscript-v1.1.0) (2022-12-05)


### Features

* show copied status ([fdc0109](https://github.com/pionxzh/chatgpt-exporter/commit/fdc0109cfe89e226e9f6862b81e33656061de492))
* support export png (screenshot) ([7aa7c0f](https://github.com/pionxzh/chatgpt-exporter/commit/7aa7c0f4fdae9e1c258b82224ad4e4fe5848d376))

## [1.0.0](https://github.com/pionxzh/chatgpt-exporter/compare/userscript-v1.0.0...userscript-v1.0.0) (2022-12-05)


### Bug Fixes

* clean up the code ([a8aa1ed](https://github.com/pionxzh/chatgpt-exporter/commit/a8aa1ed5bbb5c3262150e5353163b7a871820648))
* remove base64ed chatgpt icon ([e42aa95](https://github.com/pionxzh/chatgpt-exporter/commit/e42aa95dbde0ec4f75dd5751b31f08ab21e4b2f2))


### Continuous Integration

* fix release ([771c435](https://github.com/pionxzh/chatgpt-exporter/commit/771c435ebc69bd2fa8a6e60f96ffe041bee155bf))

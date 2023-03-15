# Changelog

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

<h1 align="center">ChatGPT Exporter</h1>

<div align="center">

## [ChatGPT](https://chatgpt.com/) 의 채팅 기록을 내보내는 GreasyFork 스크립트

[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![GreasyFork][GreasyFork-image]][GreasyFork-url]

[license-image]: https://img.shields.io/github/license/pionxzh/chatgpt-exporter?color=red
[license-url]: https://github.com/pionxzh/chatgpt-exporter/blob/master/LICENSE
[release-image]: https://img.shields.io/github/v/release/pionxzh/chatgpt-exporter?color=blue
[release-url]: https://github.com/pionxzh/chatgpt-exporter/releases/latest
[GreasyFork-image]: https://img.shields.io/static/v1?label=%20&message=GreasyFork&style=flat-square&labelColor=7B0000&color=960000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
[GreasyFork-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter

[English](./README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Français](./README_FR.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](./README_ID.md) &nbsp;&nbsp;|&nbsp;&nbsp; 한국어 &nbsp;&nbsp;|&nbsp;&nbsp; [Türkçe](./README_TR.md)

![image](https://github.com/pionxzh/chatgpt-exporter/assets/9910706/1c864670-7912-4484-b4be-bdf5dde51557)

## 설치하기

### 사전 준비 조건

<b>`Tampermonkey`</b> 설치하기

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="60" alt="Chrome" valign="middle">][link-chrome] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/214148610-acdef778-753e-470e-8765-6cc97bca85ed.png" height="60" alt="Firefox" valign="middle">][link-firefox] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/233201810-d1026855-0482-44c8-b1ec-c7247134473e.png" height="60" alt="Chrome" valign="middle">][link-edge]

[link-chrome]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo 'Chrome 웹 스토어'
[link-firefox]: https://addons.mozilla.org/firefox/addon/tampermonkey 'Firefox 애드온'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd 'Edge 애드온'

### UserScript

| Greasyfork                                                                        | GitHub                                                                                       |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [![Install][Install-1-image]][install-1-url] | [![Install][Install-2-image]][install-2-url] |

[Install-1-image]: https://img.shields.io/badge/-Install-blue
[Install-1-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter
[Install-2-image]: https://img.shields.io/badge/-Install-blue
[Install-2-url]: https://raw.githubusercontent.com/pionxzh/chatgpt-exporter/master/dist/chatgpt.user.js

#

[📚 지원하는 형식](#-지원하는-형식) &nbsp;&nbsp;|&nbsp;&nbsp; [💡 예제](#-예제) &nbsp;&nbsp;|&nbsp;&nbsp; [📤 여러 대화 내보내기](#-여러-대화-내보내기) &nbsp;&nbsp;|&nbsp;&nbsp; [🤝 기여하기](#-기여하기) &nbsp;&nbsp;|&nbsp;&nbsp;[⭐ 별 기록](#-별-기록)

</div>

#

## 📚 지원하는 형식

- [텍스트](#텍스트)
- [HTML](#HTML)
- [Markdown](#markdown)
- [PNG](#스크린샷)
- [JSON](#JSON)

## 💡 예제

### 텍스트

```
너:
ChatGPT Exporter 를 만들고 있어요. 어떻게 생각하세요?

ChatGPT:
ChatGPT Exporter 를 만들 계획이신 것 같군요. ChatGPT 는 OpenAI 에서 학습한 대규모
언어 모델로서, 주어진 입력에 기반하여 인간과 유사한 텍스트 응답을 생성하는 데
사용됩니다. 이는 챗봇, 고객 문의에 대한 자동 응답 등 다양한 응용 분야에서 활용될 수
있습니다.

하지만 대규모 언어 모델인 ChatGPT는 특정 작업을 위해 특별히 훈련된 것은 아니기
때문에 생성된 텍스트의 품질은 사용 방식과 적용되는 문맥에 따라 달라집니다. ChatGPT
를 책임있게 사용하고 해당 상황에서의 잠재적인 결과를 고려하는 것이 중요합니다.
```

### HTML

<div align="center">

<img width="643" alt="image" src="https://github.com/pionxzh/chatgpt-exporter/assets/9910706/47481c7a-4a6a-433b-b08e-fdf3bbabcb64">

</div>

### Markdown

```
---
title: ChatGPT Exporter Creation
source: https://chat.openai.com/c/cf3f8850-1d69-43c8-b99b-affd0de4e76f
author: ChatGPT
---

# ChatGPT Exporter Creation

#### You:
ChatGPT Exporter 를 만들고 있어요. 어떻게 생각하세요?

#### ChatGPT:
ChatGPT Exporter 를 만들 계획이신 것 같군요. ChatGPT 는 OpenAI 에서 학습한 대규모
언어 모델로서, 주어진 입력에 기반하여 인간과 유사한 텍스트 응답을 생성하는 데
사용됩니다. 이는 챗봇, 고객 문의에 대한 자동 응답 등 다양한 응용 분야에서 활용될 수
있습니다.

하지만 대규모 언어 모델인 ChatGPT는 특정 작업을 위해 특별히 훈련된 것은 아니기
때문에 생성된 텍스트의 품질은 사용 방식과 적용되는 문맥에 따라 달라집니다. ChatGPT
를 책임있게 사용하고 해당 상황에서의 잠재적인 결과를 고려하는 것이 중요합니다.
```

### 스크린샷

<div align="center">

<img width="480" src="https://user-images.githubusercontent.com/9910706/205663680-6ac97fac-39b0-495c-bee4-8ef37713a9ae.png" />

</div>

### JSON

API `https://chat.openai.com/backend-api/conversation/[id]` 에서 얻은 원시 콘텐츠

<details>
<summary>클릭하여 보기</summary>

```json
{
    "id": "35a1fa05-e928-4c39-8ffa-ca74f75b509f",
    "title": "AI Turing Test.",
    "create_time": 1678015311.655875,
    "mapping": {
        "5c48fa3e-e4ee-4d00-aa66-8fbcb671a358": {
            "id": "5c48fa3e-e4ee-4d00-aa66-8fbcb671a358",
            "message": {
                "id": "5c48fa3e-e4ee-4d00-aa66-8fbcb671a358",
                "author": {
                    "role": "system",
                    "metadata": {}
                },
                "create_time": 1678015311.655875,
                "content": {
                    "content_type": "text",
                    "parts": [
                        ""
                    ]
                },
                "end_turn": true,
                "weight": 1,
                "metadata": {},
                "recipient": "all"
            },
            "parent": "9310b90f-d8f0-4be6-bac2-daacddac784f",
            "children": [
                "4afb9720-3a88-49b1-9309-e2b53d607f34"
            ]
        },
        "9310b90f-d8f0-4be6-bac2-daacddac784f": {
            "id": "9310b90f-d8f0-4be6-bac2-daacddac784f",
            "children": [
                "5c48fa3e-e4ee-4d00-aa66-8fbcb671a358"
            ]
        },
        "4afb9720-3a88-49b1-9309-e2b53d607f34": {
            "id": "4afb9720-3a88-49b1-9309-e2b53d607f34",
            "message": {
                "id": "4afb9720-3a88-49b1-9309-e2b53d607f34",
                "author": {
                    "role": "user",
                    "metadata": {}
                },
                "create_time": 1678015311.656259,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "write an poem about the Turing test"
                    ]
                },
                "weight": 1,
                "metadata": {
                    "timestamp_": "absolute"
                },
                "recipient": "all"
            },
            "parent": "5c48fa3e-e4ee-4d00-aa66-8fbcb671a358",
            "children": [
                "7027f1a5-8bd5-4463-9869-8a1d1db2f9a1"
            ]
        },
        "7027f1a5-8bd5-4463-9869-8a1d1db2f9a1": {
            "id": "7027f1a5-8bd5-4463-9869-8a1d1db2f9a1",
            "message": {
                "id": "7027f1a5-8bd5-4463-9869-8a1d1db2f9a1",
                "author": {
                    "role": "assistant",
                    "metadata": {}
                },
                "create_time": 1678185638.890551,
                "content": {
                    "content_type": "text",
                    "parts": [
                        "In the realm of machines and code,\nThere lies a test, with rules bestowed,\nA challenge to determine true mind,\nAnd if a machine's intelligence can find.\n\nThe Turing test, named for its creator,\nSeeks to find if a machine's behavior\nCan mimic that of a human so well,\nThat it's indistinguishable, can you tell?\n\nThrough conversations, the test is done,\nWith a judge and a machine, the game is run,\nIf the judge can't tell who is who,\nThen the machine's intelligence shines through.\n\nBut can a machine truly think?\nOr is it just a clever bit of link,\nBetween algorithms and programming code,\nCan it truly understand and decode?\n\nThe Turing test, a thought experiment,\nBrings up questions, doubts, and sentiment,\nFor as we strive to create machines smart,\nWe wonder, will they ever truly have heart?\n\nSo let us ponder and explore,\nAs we create machines more and more,\nThe Turing test a reminder to be,\nMindful of what our machines can truly see."
                    ]
                },
                "end_turn": false,
                "weight": 1,
                "metadata": {
                    "model_slug": "text-davinci-002-render-sha",
                    "finish_details": {
                        "type": "stop"
                    },
                    "timestamp_": "absolute"
                },
                "recipient": "all"
            },
            "parent": "4afb9720-3a88-49b1-9309-e2b53d607f34",
            "children": []
        }
    },
    "moderation_results": [],
    "current_node": "7027f1a5-8bd5-4463-9869-8a1d1db2f9a1"
}
```
</details>

## 📤 여러 대화 내보내기

"모두 내보내기" 버튼을 클릭하면 **대화 내보내기** 대화 상자가 나타납니다. 여기서 다음 기능을 사용할 수 있습니다.

**공식 내보내기 파일(conversations.json)에서 내보내기**

업로드 아이콘 버튼을 클릭하여 OpenAI에서 다운로드한 JSON 형식의 대화 파일을 업로드합니다.

**API에서 내보내기**

모든 대화 목록에서 내보낼 대화를 선택합니다. "모두 선택" 체크박스를 선택하면 모든 대화를 내보낼 수 있습니다.

좌측 하단의 드롭다운 메뉴에서 내보내기 형식을 선택하세요. 다음 형식 중에서 선택할 수 있습니다.

- **Markdown**
- **HTML**
- **JSON**
- **JSON (ZIP)**

원하는 작업을 수행하려면 버튼을 클릭하세요.

- **보관** - 보관된 채팅 세션은 사이드바에서 사라지며 ChatGPT 설정에서 관리할 수 있습니다. 자세한 내용은 [#199](https://github.com/pionxzh/chatgpt-exporter/issues/199)을 참조하세요.
- **삭제** - 선택한 대화를 삭제합니다.
- **내보내기** - 선택한 대화를 선택한 형식으로 내보냅니다.

## 🤝 기여하기

[CONTRIBUTING.md](./CONTRIBUTING.md) 를 참조하세요

## ⭐ 별 기록

<div align="center">

<img src="https://api.star-history.com/svg?repos=pionxzh/chatgpt-exporter&type=Date" width="600" height="400" alt="별 기록 차트" valign="middle">

</div>

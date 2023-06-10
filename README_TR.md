<h1 align="center">ChatGPT Dışa Aktarıcı</h1>

<div align="center">
    
## [ChatGPT](https://chatgpt.com/) sohbet geçmişini dışa aktarmak için GreasyFork betiği
    
[![author][author-image]][author-url]
[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![last commit][last-commit-image]][last-commit-url]
[![GreasyFork][GreasyFork-image]][GreasyFork-url]    
    
[author-image]: https://img.shields.io/badge/author-pionxzh-orange.svg
[author-url]: https://github.com/pionxzh
[license-image]: https://img.shields.io/github/license/pionxzh/chatgpt-exporter?color=red
[license-url]: https://github.com/pionxzh/chatgpt-exporter/blob/master/LICENSE
[release-image]: https://img.shields.io/github/v/release/pionxzh/chatgpt-exporter?color=blue
[release-url]: https://github.com/pionxzh/chatgpt-exporter/releases/latest
[last-commit-image]: https://img.shields.io/github/last-commit/pionxzh/chatgpt-exporter?label=last%20commit
[last-commit-url]: https://github.com/pionxzh/chatgpt-exporter/commits
[GreasyFork-image]: https://img.shields.io/static/v1?label=%20&message=GreasyFork&style=flat-square&labelColor=7B0000&color=960000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
[GreasyFork-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter
    
English &nbsp;&nbsp;|&nbsp;&nbsp; [Indonesia](./README_ID.md) &nbsp;&nbsp;|&nbsp;&nbsp; [한국어](./README_KR.md) &nbsp;&nbsp;|&nbsp;&nbsp; Türkçe

![image](https://user-images.githubusercontent.com/9910706/215000985-887b6f9e-142b-4c25-b4bf-2ba90c0b4268.png)  
    
## Kurulum

### Gereksinimler

<align><b>`Tampermonkey`</b> kurulumu yapın</align>

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="60" alt="Chrome" valign="middle">][link-chrome] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/214148610-acdef778-753e-470e-8765-6cc97bca85ed.png" height="60" alt="Firefox" valign="middle">][link-firefox] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/233201810-d1026855-0482-44c8-b1ec-c7247134473e.png" height="60" alt="Chrome" valign="middle">][link-edge]

[link-chrome]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=tr 'Chrome Web Mağazası'
[link-firefox]: https://addons.mozilla.org/firefox/addon/tampermonkey 'Firefox Eklentileri'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd 'Edge Eklentileri'
    
### UserScript

| Greasyfork                                                                        | GitHub                                                                                       |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [![Install][Install-1-image]][install-1-url] | [![Install][Install-2-image]][install-2-url] |
    
[Install-1-image]: https://img.shields.io/badge/-Install-blue
[Install-1-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter
[Install-2-image]: https://img.shields.io/badge/-Install-blue
[Install-2-url]: https://raw.githubusercontent.com/pionxzh/chatgpt-exporter/master/dist/chatgpt.user.js
    
#
    
[Desteklenen Formatlar](#-desteklenen-formatlar) &nbsp;&nbsp;|&nbsp;&nbsp; [Örnek](#-örnek) &nbsp;&nbsp;|&nbsp;&nbsp; [Katılım](#-katılım)

</div>

#

## 📚 Desteklenen Formatlar

- [Metin](#metin)
- [HTML](#html)
- [PNG](#ekran-görüntüsü)
- [JSON](#json)

## 💡 Örnek

### Metin

```
Siz:
ChatGPT Dışa Aktarıcısı oluşturuyorum. Ne düşünüyorsunuz?

ChatGPT:
ChatGPT modelini kullanarak metin dışa aktaran bir araç oluşturmayı 
planladığınızı düşünüyorum. ChatGPT, OpenAI tarafından eğitilen büyük bir dil 
modelidir ve verilen bir girişe dayanarak insan benzeri metin yanıtları
üretmek için tasarlanmıştır. ChatGPT, sohbet botları, müşteri sorularına 
otomatik yanıtlar ve daha fazlası gibi çeşitli uygulamalar için kullanılabilir.

Ancak, lütfen unutmayın ki büyük bir dil modeli olarak, ChatGPT herhangi bir 
belirli görev için özel olarak eğitilmemiştir, bu nedenle üretilen metinlerin 
kalitesi, nasıl kullanıldığına ve hangi bağlamda uygulandığına bağlı olacaktır. 
ChatGPT'yi sorumlu bir şekilde kullanmak ve herhangi bir durumda kullanmanın 
olası sonuçlarını düşünmek önemlidir.
```

### HTML

<div align="center">

![image](https://user-images.githubusercontent.com/9910706/205630407-153fc40d-5411-482d-a75b-82bfe86e38ff.png)

</div>

### Ekran Görüntüsü

<div align="center">

<img width="480" src="https://user-images.githubusercontent.com/9910706/205663680-6ac97fac-39b0-495c-bee4-8ef37713a9ae.png" />

</div>

### JSON

API `https://chat.openai.com/backend-api/conversation/[id]` üzerinden alınan ham içerik

<details>
<summary>Görmek için tıklayın</summary>
    
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

## 🤝 Katılım

[CONTRIBUTING.md](./CONTRIBUTING.md) dosyasına bakın

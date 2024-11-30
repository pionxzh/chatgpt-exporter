<h1 align="center">ChatGPT Exporter</h1>

<div align="center">

## Skrip GreasyFork untuk mengekspor riwayat percakapan [ChatGPT](https://chatgpt.com/)

[![license][license-image]][license-url]
[![release][release-image]][release-url]
[![GreasyFork][GreasyFork-image]][GreasyFork-url]

[license-image]: https://img.shields.io/github/license/pionxzh/chatgpt-exporter?color=red
[license-url]: https://github.com/pionxzh/chatgpt-exporter/blob/master/LICENSE
[release-image]: https://img.shields.io/github/v/release/pionxzh/chatgpt-exporter?color=blue
[release-url]: https://github.com/pionxzh/chatgpt-exporter/releases/latest
[GreasyFork-image]: https://img.shields.io/static/v1?label=%20&message=GreasyFork&style=flat-square&labelColor=7B0000&color=960000&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3ggEBCQHM3fXsAAAAVdJREFUOMudkz2qwkAUhc/goBaGJBgUtBCZyj0ILkpwAW7Bws4yO3AHLiCtEFD8KVREkoiFxZzX5A2KGfN4F04zMN+ce+5c4LMUgDmANYBnrnV+plBSi+FwyHq9TgA2LQpvCiEiABwMBtzv95RSfoNEHy8DYBzHrNVqVEr9BWKcqNFoxF6vx3a7zc1mYyC73a4MogBg7vs+z+czO50OW60Wt9stK5UKp9Mpj8cjq9WqDTBHnjAdxzGQZrPJw+HA31oulzbAWgLoA0CWZVBKIY5jzGYzdLtdE9DlcrFNrY98zobqOA6TJKHW2jg4nU5sNBpFDp6mhVe5rsvVasUwDHm9Xqm15u12o+/7Hy0gD8KatOd5vN/v1FozTVN6nkchxFuI6hsAAIMg4OPxMJCXdtTbR7JJCMEgCJhlGUlyPB4XfumozInrupxMJpRSRtZlKoNYl+m/6/wDuWAjtPfsQuwAAAAASUVORK5CYII=
[GreasyFork-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter

[English](./README.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Français](./README_FR.md) &nbsp;&nbsp;|&nbsp;&nbsp; Indonesia &nbsp;&nbsp;|&nbsp;&nbsp; [한국어](./README_KR.md) &nbsp;&nbsp;|&nbsp;&nbsp; [Türkçe](./README_TR.md)

![image](https://github.com/pionxzh/chatgpt-exporter/assets/9910706/0697599c-2432-4eae-bc6a-ea4b6ecf89aa)

## Instalasi

### Prasyarat

<align>Instal <b>`Tampermonkey`</b></align>

[<img src="https://user-images.githubusercontent.com/3750161/214147732-c75e96a4-48a4-4b64-b407-c2402e899a75.PNG" height="60" alt="Chrome" valign="middle">][link-chrome] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/214148610-acdef778-753e-470e-8765-6cc97bca85ed.png" height="60" alt="Firefox" valign="middle">][link-firefox] &nbsp;&nbsp; [<img src="https://user-images.githubusercontent.com/3750161/233201810-d1026855-0482-44c8-b1ec-c7247134473e.png" height="60" alt="Chrome" valign="middle">][link-edge]

[link-chrome]: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo 'Web Store Chrome'
[link-firefox]: https://addons.mozilla.org/firefox/addon/tampermonkey 'Add-ons Firefox'
[link-edge]: https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd 'Add-ons Edge'

### UserScript

| Greasyfork                                                                        | GitHub                                                                                       |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| [![Install][Install-1-image]][Install-1-url] | [![Install][Install-2-image]][Install-2-url] |

[Install-1-image]: https://img.shields.io/badge/-Install-blue
[Install-1-url]: https://greasyfork.org/scripts/456055-chatgpt-exporter
[Install-2-image]: https://img.shields.io/badge/-Install-blue
[Install-2-url]: https://raw.githubusercontent.com/pionxzh/chatgpt-exporter/master/dist/chatgpt.user.js

#

[📚 Format yang Didukung](#-format-yang-didukung) &nbsp;&nbsp;|&nbsp;&nbsp; [💡 Contoh](#-contoh) &nbsp;&nbsp;|&nbsp;&nbsp; [📤 Ekspor Beberapa Percakapan](#-ekspor-beberapa-percakapan) &nbsp;&nbsp;|&nbsp;&nbsp; [🤝 Kontribusi](#-kontribusi) &nbsp;&nbsp;|&nbsp;&nbsp; [⭐ Sejarah Bintang](#-sejarah-bintang)

</div>

#

## 📚 Format yang Didukung

- [Teks](#teks)
- [HTML](#html)
- [Markdown](#markdown)
- [PNG](#tangkapan-layar)
- [JSON](#json)

## 💡 Contoh

### Teks

```
Anda:
Saya sedang membuat ChatGPT Exporter. Apa pendapat Anda?

ChatGPT:
Sepertinya Anda berencana membuat alat yang menggunakan model ChatGPT
untuk mengekspor teks. ChatGPT adalah model bahasa yang besar yang dilatih oleh OpenAI
yang dirancang untuk menghasilkan teks yang mirip dengan manusia berdasarkan input yang diberikan.
Model ini dapat digunakan untuk berbagai aplikasi, seperti chatbot,
respon otomatis terhadap pertanyaan pelanggan, dan lain-lain.

Namun, perlu diingat bahwa sebagai model bahasa yang besar, ChatGPT tidak
telah dilatih secara khusus untuk tugas tertentu, sehingga kualitas teks yang
dihasilkan akan bergantung pada bagaimana penggunaannya dan konteks di mana
ini diterapkan. Penting untuk menggunakan ChatGPT dengan tanggung jawab dan
mempertimbangkan konsekuensi potensial penggunaannya dalam situasi apa pun.
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
Saya sedang membuat ChatGPT Exporter. Apa pendapat Anda?

#### ChatGPT:
Sepertinya Anda berencana membuat alat yang menggunakan model ChatGPT
untuk mengekspor teks. ChatGPT adalah model bahasa yang besar yang dilatih oleh OpenAI
yang dirancang untuk menghasilkan teks yang mirip dengan manusia berdasarkan input yang diberikan.
Model ini dapat digunakan untuk berbagai aplikasi, seperti chatbot,
respon otomatis terhadap pertanyaan pelanggan, dan lain-lain.

Namun, perlu diingat bahwa sebagai model bahasa yang besar, ChatGPT tidak
telah dilatih secara khusus untuk tugas tertentu, sehingga kualitas teks yang
dihasilkan akan bergantung pada bagaimana penggunaannya dan konteks di mana
ini diterapkan. Penting untuk menggunakan ChatGPT dengan tanggung jawab dan
mempertimbangkan konsekuensi potensial penggunaannya dalam situasi apa pun.
```

### Tangkapan Layar

<div align="center">

<img width="480" src="https://user-images.githubusercontent.com/9910706/205663680-6ac97fac-39b0-495c-bee4-8ef37713a9ae.png" />

</div>

### JSON

Konten mentah dari API `https://chat.openai.com/backend-api/conversation/[id]`

<details>
<summary>Klik untuk melihat</summary>

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

## 📤 Ekspor Beberapa Percakapan

Ketika Anda mengklik tombol "Ekspor Semua", dialog **Ekspor Percakapan** akan muncul. Berikut adalah fungsi-fungsi yang dapat Anda akses.

**Ekspor dari file ekspor resmi (conversations.json)**

Klik tombol ikon unggah untuk mengunggah file JSON percakapan, seperti yang diunduh dari OpenAI.

**Ekspor dari API**

Dalam daftar semua percakapan Anda, pilih percakapan mana yang ingin Anda ekspor. Centang kotak "Pilih Semua" untuk mengekspor semua percakapan Anda.

Pilih format ekspor Anda dari menu dropdown di kiri bawah. Anda dapat memilih dari format berikut:

- **Markdown**
- **HTML**
- **JSON**
- **JSON (ZIP)**

Klik tombol untuk melakukan tindakan yang diinginkan.

- **Arsipkan** - Sesi obrolan yang diarsipkan akan menghilang dari bilah sisi dan dapat dikelola di pengaturan ChatGPT. Lihat [#199](https://github.com/pionxzh/chatgpt-exporter/issues/199) untuk detail lebih lanjut.
- **Hapus** - Menghapus percakapan yang dipilih.
- **Ekspor** - Mengekspor percakapan yang dipilih dalam format yang dipilih menggunakan pemilih format.

## 🤝 Kontribusi

Lihat [CONTRIBUTING.md](./CONTRIBUTING.md)

## ⭐ Sejarah Bintang

<div align="center">

<img src="https://api.star-history.com/svg?repos=pionxzh/chatgpt-exporter&type=Date" width="600" height="400" alt="Star History Chart" valign="middle">

</div>

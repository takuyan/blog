---
title: werckerのbundle-installでcloud-not-foundとか言われたらbundlerのversionを指定してみよう
date: 2015-03-18 16:30 JST
tags: rails, ci
thumb: /images/2015/wercker-bundle-install.png
---

- `bundle update`で`thread_safe`のバージョンが上がる
- werckerの`bundle-install`stepで`Could not find thread_safe-0.3.5 in any of the sources`と言われる
- しかしrubygemsには存在している
- ナニコレコワイ
- bundle-install ステップにversion: 1.8.5を指定
- ( ⁰⊖⁰)/)[ 解決 ]/)

READMORE

## wercker.ymlの確認

werckerのbundle-installステップはgithubにある。  
[https://github.com/wercker/step-bundle-install](https://github.com/wercker/step-bundle-install)

[最近どうやらversionを指定できるようになった](https://github.com/wercker/step-bundle-install#112)とのこと。  
やってみよう。

```yml
build:
    steps:
        - bundle-install:
            version: 1.8.5
```

とりあえずコレで直った。  
調べていくうちに「自作box作らなきゃいけないの？」とかいろいろ不安になったので記事にしておくことにした。

## 参考資料

- [Werckerの仕組み，独自のboxとstepのつくりかた](http://deeeet.com/writing/2014/10/16/wercker/)

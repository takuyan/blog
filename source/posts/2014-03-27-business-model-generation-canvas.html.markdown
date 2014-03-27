---
title: リハビリのつもりがサービスを公開していた話
date: 2014-03-27 17:03 JST
tags: business, rails, backbonejs
thumb: /images/portfolio/businessmodelcanvas.png
---

<img class='img-responsive img-rounded' src='/images/portfolio/businessmodelcanvas.png' />

[ビジネスモデルキャンバス.com](http://xn--nckvadb2e8ayas2lma0gwe.com/)

仕事で[Backbone.js](http://backbonejs.org/)と[Marionette.js](http://marionettejs.com/)を使っている部分があるのだけど、そこに大きめの変更が入ることになった。

しばらくMarionette.jsを触っていなかったし、本家のバージョンも上がっていたので、リハビリとして何かつくろうと思った。

READMORE

## なぜビジネスモデルキャンバスか

そこで、以前に本で読んで、コレは良いなあと思いつつ、なかなか実践に移せなかった**ビジネスモデルキャンバス**をつくろうと思った。

「[ビジネスモデル・ジェネレーション](http://www.amazon.co.jp/gp/product/4798122971/ref=as_li_ss_il?ie=UTF8&camp=247&creative=7399&creativeASIN=4798122971&linkCode=as2&tag=kattttttttton-22)」という本があり、それ自体は読んだことは無いんだけど、WEBで大体把握していた。
その上で、似たような「[ビジネスモデル・YOU](http://www.amazon.co.jp/gp/product/4798128147/ref=as_li_ss_il?ie=UTF8&camp=247&creative=7399&creativeASIN=4798128147&linkCode=as2&tag=kattttttttton-22)」という本を読んでいた。

このビジネスモデルキャンバス、本は読んだけど、実際にコレを書いてみようと思うと**すごくハードルが高い**と思っていた。  
[本のサポートページ](http://www.businessmodelgeneration.com/canvas)から、PDFでダウンロード出来るんだけど、印刷して「よしやろう！」という気にはならなかった。
私は基本的に面倒くさがり屋なのである。

## 作り始め

フロントエンドのリハビリの予定なので、[Middleman](http://middlemanapp.com/jp/)とBackbone.Localstorageをつかおうと決めた。
リハビリだけあって、けっこう四苦八苦して作った気がする。

作ったあとに一人で使っていたのだが、これが思いの外、たのしい。

「これをやりたいひとって、たくさんいるはずだよなあ」と思った時点で公開することを決めた。

## 公開に向けて

そのまま公開しても良かったんだけど、Localstorageじゃブラウザに依存するし、他人に公開もできない。  
なにそれ、つまらない。もっと、こう、楽しくあるべきでしょう。

で、Railsでプロジェクトを作成して、ウワモノ( backbone等 )を移植して。
キャンバスをProjectでラップして、Projectをユーザに紐付けて、ゴニョゴニョと。

先週の土曜の夜に作り始めて、通勤電車の中で開発を進めた。  
で、今朝、通勤電車の中からデプロイをキメて、公開した。  
ドメインは昨日買った。

## マネタイズ？

こういう経緯で作ったので「マネタイズはどう考えてますか？」って聞かれて「うっ」となった。

うーん。

必要としているひとからいただくのが定石ですよね。  
であれば、**キャンバスx個までは無料、ソレ以上は課金**、というパターンか？

[WebPay](https://webpay.jp/)とか使ってみたいので、その練習がてら課金システムあるかもしれんね。

## まとめ

**自分がユーザであるモノを作れば迷うことはない**と、ほんとにそう思うのでした。

[ビジネスモデルキャンバス.comはこちら](http://xn--nckvadb2e8ayas2lma0gwe.com/)


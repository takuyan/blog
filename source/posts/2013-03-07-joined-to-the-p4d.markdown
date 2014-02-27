---
title: "デザインの壁は #p4d に参加して乗り越えるべき"
date: 2013-03-07 08:24
comments: true
tags: ruby, design, rails
---

<img class='img-thumbnail' src='/images/2013/p4d.png' />

[第16回 デザイナー向けプログラム部 #p4d at 万葉](http://connpass.com/event/1849/) に参加してきました！

[#p4d](http://prog4designer.github.com/)というのは**デザイナーとプログラマーで集まって Web や アプリをつくったりデザインやプログラミングについて相談したりする会**です。

色っけのない[ProofofLife](http://proofoflife.me/ja) のデザインをプロのデザイナーさんに観て頂きたく、また、率直な感想を聞きたくて参加しました。

現役のデザイナーさんから助言を受けることが出来て、とっても満足度が高いイベントだったと言えます。今後は、逆に、デザイナーさんに何かを教えることが出来れば良いなぁと思いました。

なので、デザイナーさんは、こぞって [#p4d](http://connpass.com/series/155/)に参加されると良いと思いました。 #ステマ

READMORE

## デザインチェック

<img class='img-thumbnail' src='/images/2012/proofoflife.png' />

### デザインの前に

<img class='img-thumbnail' src='/images/2013/ikesai.png' />

似たようなコンセプトのデザインを真似ると良い、とのこと。そしてご存知[ikesai.con](http://www.ikesai.com)で探すと良い、と。

例えば、高級感を出したいなら「黒に金で、フォントは白抜き」などのパターンがあるので、そういったものを取り入れよう、と。

「ゼロからデザインをやるよりは、既に完成しているデザインを参考にしたほうが絶対良い物になる」という話を聞いて、プログラムと同じように、デザインだって写経からスタートするんだなあと、新鮮な思いがありました。

### Skeuomorphic Design

ファーストビューに飛び込んでくる「**29days 23hours 59minutes 44seconds**」が、**利用者の最後のメッセージを送信するまでの日数である**ということがわからんとのことでした。なので、身近にあるもので、それと表現すると良いとのこと。

<img class='img-thumbnail' src='/images/2013/iphone_calender_icon.jpg' />

あとで調べたのですが[Appleが推奨するSkeuomorphic Designとそのメリットデメリット](http://design-spice.com/2012/04/06/skeuomorphic-design/)という記事で紹介されていたので、よく読もうと思います。

### フォントがポップすぎる

<img class='img-thumbnail' src='/images/2013/pop_font.png'>

``` css
font-family: 'Emilys Candy', cursive
```

テーマが「死」の割にフォントがポップ過ぎる気がする、Times などが合うのではないか、と言われました。

実際に変更してみた。

<img class='img-thumbnail' src='/images/2013/times_font.png' />

``` css
font-family: Times
```
### 操作性はとても良い

<img class='img-thumbnail' src='/images/2013/inside_proofoflife.png' />

ログインしてからのチュートリアルや、メッセージ送信先の登録、メッセージ登録、宛先指定、の流れなどが、わかりやすくスムーズだとの言われて少し嬉しかったです。

## ユーザーに遭遇

また、一番の衝撃だったのが「生存証明の作者さんですか？わたし、使ってます！」というユーザーさんがいたことですね。
もう、冥利に尽きるという一言です。

至らない部分がいろいろあることがわかっているので、それを放置してしまっていることを途端に恥じるような気分になりました。

クックパッドさんの言う[一行のログの向こうには、一人のユーザがいる](http://ihara2525.tumblr.com/post/17029509298)を実感しました。

論理的に当たり前のことですが、やはり実感に優るものはありませんね。



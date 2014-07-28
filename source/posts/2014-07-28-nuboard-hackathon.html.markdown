---
title: "nuboard x p4d のハッカソンに参加した #nuhack"
date: 2014-07-28 16:20 JST
tags: hackathon, idobata, nuboard, github
thumb: /images/2014/nuhack-present.jpg
---

NUboard使ってますか？  
そのNUboardを作っている欧文印刷さんとp4dで[ハッカソン](http://ja.wikipedia.org/wiki/%E3%83%8F%E3%83%83%E3%82%AB%E3%82%BD%E3%83%B3)をやるという話があったのでお邪魔してきました。

READMORE

## 誰と何を作ったの

フィヨルドの[@machida](https://twitter.com/machida)さんと一緒に「写真で道案内を作れるサービス：kulku」を作りました。

<img src='/images/2014/kulku.png' class='img-responsive img-thumbnail' alt='kulku' />

一日(実質8hくらい)のハッカソンなので、その日のうちに、ある程度の成果を発表しなければいけません。  
私も町田さんもネタ方向に走るタイプでは無いので、実用的なものを作ろうということになりました。

### まずはじめにPOEMありき

<img src='/images/2014/kulku-poem.png' class='img-responsive img-thumbnail' alt='kulku' />

私は[PDD(ポエム駆動開発)の信奉者](/posts/2014/02/27/poem/)なので、開発前にポエムを書きました。  
ポエムを書くとペルソナがハッキリするので、やらなくていいことを切り分けるのが楽になるので、オススメです。

### 現場の様子です

<img src='/images/2014/nuhack.jpg' class='img-responsive img-rounded' alt='NUboardを使って作業をしている様子' />

実際にNUboardを使って導線などを検討しながら実装を進めました。  
ピクシブさんでは「最近は **レッドブルよりミニッツメイドがヤバい、ガッとクルヨ( ⁰⊖⁰)！** 」とのことで、たくさん戴きました。美味しかったです！

[Google Street View Image API](https://developers.google.com/maps/documentation/streetview/?hl=ja) というものがあり、そのパラメータの扱われ方に1hr近く四苦八苦してしまいました。おかげでドメインを取得したり、リリースしたり、みたいな作業をする時間が無くなってしまったのがアレでした。

### nuhack x idobata

idobataでnuhack用のroomを用意して、みんなのgithubリポジトリのアクティビティが流れるような運用にしていました。コレのお陰でみんなの動きがわかるし、終盤のpushぶりはスゴいものがありました。

中には、かなり最初の方からデプロイして威嚇するなど、心理戦の様相を呈していたり、とても楽しかったです。

<img src='/images/2014/nuhack-idobata.png' class='img-responsive img-rounded' alt='デプロイして威嚇している様子' />

### ハッカソンでもテスト

今回はGoogle Mapを中心に扱うサービスだったので、開発の中心はJavascript( CoffeeScript/Backbone.js )でした。  
ハッカソンなので、とにかく時間が無く、テストは書かないケースが多いようですが、今回Railsのコントローラ部分の最低限のテストは書いてから実装をしました。

JSメインだからこそ、RailsのエラーとJSのエラーは素早く切り分ける必要があります。
無駄なハマりをしないためにも、テストって重要だなーと実感しました。

## 所感

こういう場所で初めて組む相手と一日でサービスを作る経験というのは、得難い経験でした。
町田さんとはずっと何か一緒に作りたいと思っていたので、すごく楽しかったです（私だけ）

もう作っている最中から「町田さん！これチョー便利ですよ！スゴいっす！」とバカみたいなことを喋っていました（だがリリースできなかった）。
手も動くけどクチも動く癖を治したいと思います。

なお、kulkuは8/19を目処にβリリースを予定しています＞＜！

### ピクシブさんスゴい

<img src='/images/2014/pixiv-office.png' class='img-responsive img-rounded' alt='ピクシブ社内でワイワイしている' />

大きな冷蔵庫にあるフリードリンク（アルコール含む）や仮眠室など、エンジニアに良い環境を提供している会社なんだなあというオーラがスゴく伝わってきました。  
ハッカソン当日は土曜日だったにも関わらず、少なくない社員の方が出社しており、趣味の時間を満喫しているのを見るにつけ、社員に愛されている会社だなあと感じました。

<img src='/images/2014/pixiv-office2.jpg' class='img-responsive img-rounded' alt='歓談' />

オモシロソウなものがたくさんあったので、ハッカソン終了後はみんなで絵馬を見たり、資料を物色してました。

<img src='/images/2014/pixiv-office-with-ebichang.png' class='img-responsive img-rounded' alt='物色' />

<small>写真は多少ぼかしています</small>

### 欧文印刷さんからプレゼント

欧文印刷さんから、参加者の皆さんに、たくさんプレゼント貰いました！
私は-gramPadの他に、バインダータイプの nu board を戴きまして、とても嬉しかったです！！

<a href="http://www.amazon.co.jp/gp/product/B00LNRDM1S/ref=as_li_ss_il?ie=UTF8&camp=247&creative=7399&creativeASIN=B00LNRDM1S&linkCode=as2&tag=kattttttttton-22"><img border="0" src="http://ws-fe.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00LNRDM1S&Format=_SL250_&ID=AsinImage&MarketPlace=JP&ServiceVersion=20070822&WS=1&tag=kattttttttton-22" ></a><img src="http://ir-jp.amazon-adsystem.com/e/ir?t=kattttttttton-22&l=as2&o=9&a=B00LNRDM1S" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

とても高級感があってオススメです！ゼヒ！

## あわせて読みたい

[ブログを書こう · Issue #10 · satococoa/p4d-hackathon-3rd](https://github.com/satococoa/p4d-hackathon-3rd/issues/10)

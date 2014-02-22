---
title: "jQuery1.9に備えてlive()をon()に修正しましょう"
date: 2013-01-28 23:00
comments: true
categories: [javascript, jquery]
---

{% img /images/2013/jquery-1-dot-9-upgrade.png %}

**2013年 ■□□□□□□□□□□□ 9% Done**

2013年の1/12(じゅうにぶんのいち)が早々に終わろうとしていますが、皆様、いかがお過ごしでしょうか。
先日、**Railsで呼び出されるjqueryのバージョンが1.9になり、`live`関数まわりが大挙してエラーを吐いて** おります。

至急コイツをどげんかする必要があります。

ステップ・バイ・ステップで直そうと思います。

## 方針

1. とりあえず`live`関数を復活させる（消極的解決）
2. 有無を言わさず全部修正する（積極的解決）

## 1. 互換性を維持するjquery-migrateを使う

全て壊れたままというのも癪なので、まずは動くようにしたいところ。
そう考えていたら[jquery-migrate](https://github.com/jquery/jquery-migrate/)というジャストなぷらぎんがありました。(当たり前)

GithubのREADMEによると、以下のようにすれば良いとか。

``` html
<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.0.0.js"></script>
```

jqueryは1.9じゃねぇのという疑問とかあるので、とりあえずコレは無視します。

Railsエンジニアらしく、`vendor/assets/javascripts`あたりに[jquery-migrate](http://code.jquery.com/jquery-migrate-1.0.0.min.js)を突っ込んでおきましょうか。
そして、`application.js`などで呼び出せばおｋ。

``` javascript
//= require jquery
//= require jquery-ui
//= require jquery_ujs
//= require jquery-migrate-1.0.0
//= require_self
```

ひとまずコレで動く。「いまは時間がない！」てな人はコレで良しとしましょうか。

「技術的負債、こわい！」という私みたいな人は、次へ進みます。

## 2. 本格的に修正する

### 動的に追加した要素にイベントを追加する

よく`todos#index.js.erb`とか書くとき、こんなかんじで動的に要素を追加しますね。しますよね。

``` javascript
$("#todo_list").html("<li id='todo_1'>歯を磨く</li>");
```

### Before jQuery 1.9

このような **ブラウザが読み込んだ時には存在しない要素にイベントを追加する** 場合、次のように書いていました。

``` javascript
// クリックすると何かが開く程度の認識で良いです
$("#binder_open").live('click', function(){
  $(this).addClass("hide");
  $("#binder").addClass("open");
  $("html,body").animate({ scrollTop: 0}, 600);
});
// クリックすると何かが閉じる程度の認識で良いです
$("#binder .binder_close, #footer_close").live("click", function(){
  $("#binder_open").removeClass("hide");
  $("#binder").removeClass("open");
});
```

### After jQuery 1.9

で、この`live`関数は、しばらく前から非推奨になっていました。
これを`on`関数で統一しましょう。

``` javascript
$("body")
  .on('click', '#binder_open', function(){
    $(this).addClass("hide");
    $("#binder").addClass("open");
    $("html,body").animate({ scrollTop: 0}, 600);
  })
  .on("click", "#binder .binder_close, #footer_close", function(){
    $("#binder_open").removeClass("hide");
    $("#binder").removeClass("open");
  });
```

コレ、すごく気になるのが、`$('body')` とか、 `$(document)`に全部`.on()`してもいいのかなってこと。

## 参考情報

#### [jQuery Core 1.9 Upgrade Guide](http://jquery.com/upgrade-guide/1.9/)

jqueryの公式アップグレードガイド。詳しく書いてある。とても詳しく書いてある。

#### [jQuery 2.0β登場！ jQuery 1.9は正式版がリリース](http://www.atmarkit.co.jp/ait/articles/1301/17/news092.html)

@ITの記事。

#### [jQuery 1.7の on() off()について調べてみた](http://c-brains.jp/blog/wsg/11/11/08-161217.php)
#### [jQuery 1.9 で変わったところを調べてみる。](http://c-brains.jp/blog/wsg/13/01/21-202603.php)

こちら２つともバシャログさん。
jQuery1.9についてしっかり解説が欲しい場合は、こちらを確認するのが吉。

## Rubyistは今年も大変そう

2月にはRubyも2.0になる予定だし、そろそろRailsが4.0になるし、Rubyistは2013年は休まる暇は無さそうですね。
でも私含めRubyistの皆さんは、基本的に新しいモノ大好きなマゾヒストが多い印象なので、楽しく過ごせるんじゃないかなと思っていますがね！

Enjoy Programming !!


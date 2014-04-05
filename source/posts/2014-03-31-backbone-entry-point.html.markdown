---
title: 'Re: Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？'
date: 2014-03-31 16:18 JST
tags: backbonejs, marionettejs, javascript
thumb: /images/2014/marionettejs.png
---

[Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？ - @kyanny's blog](http://blog.kyanny.me/entry/2014/03/31/033140)

**わたくしの場合は[Marionette.js](http://marionettejs.com/)のControllerを使う**、となる。  
どうか「新しいフレームワークの話なら結構です」とか思わないで。結構便利なんですよコレ。

READMORE

## How To Use

ブログ記事の編集画面だけ**やたらにリッチクライアント**なパターンを考えましょう。  
なお、Rails x Backbone.js ということで、Assets Pipelineを使う前提です。

<img src='/images/2014/rich_editor.png' class='img-rounded img-responsive' alt='Rich Editor' />

ここで考えるのは、`awesomeblog.com/articles/123/edit`のときだけBackbone化したいパターンです。

``` coffee
# app/assets/javascripts/rich.js.coffee
window.Rich = 
  Controllers: {}
  Routers: {}
  Views: {}
  initialize: ->
    Rich.Application = new Backbone.Marionette.Application()
    Rich.Application.addInitializer -> Backbone.history.start()
    Rich.Application.start()

$(document).ready ->
  Rich.initialize()
```

まずは上のような感じで初期化。  
次に、いわゆる`application.js`を見てみます。

``` coffee
#= require jquery
#= require jquery_ujs
#= require underscore
#= require backbone
#= require backbone.marionette
#= require rich
#= require_tree ./views
#= require_tree ./controllers
#= require_tree ./routers
#= require_self

url = document.location.pathname 
if url.match('/articles/([0-9]+\)/edit$') # 1.
  controller = new Rich.Controllers.Article(id: RegExp.$1) # 2.
  controller.edit() # 3.
```

1. urlでDispatchして
2. ArticleなControllerのインスタンスを取り出して
3. `edit()`を実行

エントリーポイントの話はこれだけです。  

## Controllerってなに？

さて、Controllerの中身を見てみましょう。

``` coffee
#= require rich
# app/assets/javascripts/controllers/article.js.coffee
class Rich.Controllers.Article extends Marionette.Controller
  initialize: (options) ->
    @article_id = options.id

  edit: ->
    Rich.Application.addRegions
      header: '#header'
      side: '#side'
      main: '#main'

    @article = new Rich.Models.Article(id: @article_id)
    @article.fetch(reset: true)
      .done =>
        headerView = new Rich.Views.ArticleHeader(model: @article)
        Rich.Application.header.show(headerView)

        sideView = new Rich.Views.ArticleSide(model: @article)
        Rich.Application.side.show(sideView)

        mainView = new Rich.Views.ArticleMain(model: @article)
        Rich.Application.main.show(mainView)
```

`fetch`あたりがキモいですが、結構普通のコントローラになっております。  
この`edit`部分だけを呼び出すことで、部分的にBackbone化することを実現しております。

> `addRegions`あたりが気になった方へ  
> **この枠にこのViewを突っ込む**という指示を明確にやっています。  
詳細は[こちら(英語)](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md)へ。

> ここらへんからがMarionette.jsの面白いところですが、ソレはまた今度。

## なにが嬉しい？

実はこのコントローラはRouterと合体することができます。  
(というかそれが本来の使い方)

``` coffee
#= require rich
#= require controllers/article
#= require application
# app/assets/javascripts/routers/article.js.coffee
class Rich.Routers.Article extends Backbone.Marionette.AppRouter
  controller: Rich.Controllers.Article

  appRoutes:
    '': 'edit'
```

Router側はこれだけです。  
これはコントローラの再利用性をあげるために、ルーティング処理とコントローラを分けている、とのこと。
もちろん、普通の`routes`も追加することはできます。

そんなわけで、**Router側にはルーティングのみ、そこで呼び出すアクション(例：edit）はコントローラで定義しましょう**、というのがMarionette.jsの考え方です。

エントリーポイントの話に限れば、直接コントローラを呼び出すと楽ぽいよ、私は最近そんな感じで楽してます、という話でした。

## Marionette.js について

[Githubリポジトリのdoc](https://github.com/marionettejs/backbone.marionette/tree/master/docs)を読むと大抵わかります。  
Marionette.js は必要な部分だけ掻い摘んで使うこともできるので、少しづつBackboneを進化させてたいなあと思っているひとにもオススメです。

## 参考

[Re: Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？](http://webtech-walker.com/archive/2014/03/javascript-entry-point.html)  
※ 外村さんのブログ

補足： ツッコミ歓迎ですので、ビシバシと指摘して頂ければと思います！

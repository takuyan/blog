---
title: RailsエンジニアのためのBackbone.js入門 (1)
date: 2014-04-03 07:00 JST
tags: rails, backbonejs
thumb: /images/2014/backbonejs.png
---

- Railsエンジニアなんだけど、フロントエンドもやってみたい、やらねばならぬ
- Backbone.jsは分かるが、今更、生Javascriptとか生HTMLを書くのはツラい

そんなひと向けにRailsでBackbone.jsをストレスレスに始めるポイントだけ書きます。

READMORE

## 心構え

- Backbone.jsは「楽をするためのフレームワークではない」
- Railsみたいな「魔法」は無い

ここを勘違いしているとあとでギャップがツラいレベルに達するので注意が必要。  
私は勘違いしていて、優秀なフロントエンドエンジニアに上記の言葉をもらってハッした。

ただ、**フロントエンドでも楽をしたいならEmber.jsとかAngular.js**とか、そっちに行くと良いとは思う。  

### Ember.js

Ember.jsは素晴らしい。けど、追加で学習コストを支払う余裕が有るなら先にBackbone.jsを習得したほうが良い。間違いなく飲み込みが早い。  
それと**ember-data**というREST用のデータ連携モジュールがあるのだけど、この1.0リリースが為されたなら、私もまた使い始めようと思っている。**v1.0リリース後なら使いたい、ここ重要。**  

[Ember.js](http://emberjs.com)

### Angular.js

Angular.jsは構文の独自性に拒否感がないなら、良い使い手になれるのではないか。  
※個人の感想です (退路を作っておく)

[Angular.js](http://angularjs.org/)


### 開発手法に関する心構え

- Eventドリブンな開発を知らないなら、これに慣れる必要がある
- よってBackbone.jsによる開発はRailsによる開発より進捗がでない

非同期です。非同期なんです。  
`Deferred`という言葉を知らなければ、これに出会うはずなので、先にリンクを置いておきます。

- [爆速でわかるjQuery.Deferred超入門](http://techblog.yahoo.co.jp/programming/jquery-deferred/)
- [結局jQuery.Deferredの何が嬉しいのか分からない、という人向けの小話](http://qiita.com/yuku_t/items/1b8ce6bba133a7eaeb23)

[Re: Single Page Application ではない場合 JavaScript コードのエントリポイントはどこにあるべきか？](/posts/2014/03/31/backbone-entry-point/) のController部分の`fetch(reset: true).done =>`の部分がなぜ必要なのか分かると思います。

## Gemfile

Backbone用のgemがいくつかありますが、`backbone-on-rails`を使います。  

[meleyal / backbone-on-rails](https://github.com/meleyal/backbone-on-rails)

理由は継続的な開発をしているかどうかです。  
ただ、最近になって[codebrew / backbone-rails](https://github.com/codebrew/backbone-rails)も開発を再開したぽいので気になってます。

``` ruby
gem 'backbone-on-rails'

# BackboneのテンプレートをHamlで書きたい
gem 'haml_coffee_assets'
gem 'therubyracer', platforms: :ruby

# json用
gem 'jbuilder', '~> 1.2'

# turbolinks 使うなら
gem 'turbolinks'
gem 'jquery-turbolinks'
```

## ディレクトリ構造

大体こんな感じになります。
`templates`の場所が不思議だけど、`haml_coffee_assets`を使う上でここに置くことになってます。※ [ここらへん](https://github.com/netzpirat/haml_coffee_assets#sprocket-jst-processor-template-generation)

``` sh
$ tree app/assets 

app/assets
├── images
├── javascripts
│   ├── application.js.coffee
│   ├── bmg.js.coffee
│   ├── collections
│   │   ├── articles.js.coffee
│   │   └── blogs.js.coffee
│   ├── controllers
│   │   └── main.js.coffee
│   ├── layouts
│   │   ├── main.js.coffee
│   │   └── articles.js.coffee
│   ├── main.js.coffee
│   ├── models
│   │   ├── article.js.coffee
│   │   └── blog.js.coffee
│   ├── published.js.coffee
│   ├── routers
│   │   └── main.js.coffee
│   └── views
│       ├── article.js.coffee
│       ├── articles.js.coffee
│       ├── blog.js.coffee
│       └── blogs.coffee
├── stylesheets
│   └── application.css.sass
└── templates
    └── blogs
        ├── index
        │   └── hoge.jst.hamlc
        └── show
            └── fuga.jst.hamlc
```

## 事始め

さて、次回から実際に中身を書いてみます。  

``` coffee
# app/assets/javascripts/application.js.coffee
#= require jquery
#= require jquery.turbolinks # turbolinks使う場合
#= require jquery_ujs
#= require bootstrap # bootstrap使う場合
#= require hamlcoffee
#= require underscore
#= require backbone
#= require rich # これがメイン
#= require_tree ../templates
#= require_tree ./models
#= require_tree ./collections
#= require_tree ./views
#= require_tree ./routers
#= require_self
#= require turbolinks # turbolinks使う場合
# TODO
```

### [wip] RailsエンジニアのためのBackbone.js入門 (2)

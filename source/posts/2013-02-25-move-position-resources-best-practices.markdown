---
title: "Railsのリスト操作におけるURL設計"
date: 2013-02-25 22:49
comments: true
categories: [ruby, rails, design]
---

[前回の記事](/blog/2013/02/19/consideration-of-how-to-operate-the-list-on-rails/)を基に、Facebookで [#sendagayarb](https://twitter.com/search?q=%23sendagayarb) の皆さんとディスカッションした内容をここに残しておきます。

## 前回までの流れ

以下の様なリソースがあった場合、どのようなURL/コントローラで`move_higher`や`move_to_bottom`メソッドを叩くのか、というお題。

``` ruby

#from_README_Example.rb

class TodoList < ActiveRecord::Base
  has_many :todo_items, order: "position"
end

class TodoItem < ActiveRecord::Base
  belongs_to :todo_list
  acts_as_list scope: :todo_list
end

todo_list.first.move_to_bottom
todo_list.last.move_higher
```

``` ruby

# routes.rb
resources :todo_lists, shallow: true do
  resources :todo_items
end
```

## リソースは何なのかを見極める

今回のリソースは**「Itemの順序」**です。

この**「Itemの順序を更新する」**という行為を、以下のように表現するべきだろうという結論になりました。

```

PUT /todo_lists/1/todo_items/2/position?move=bottom
```

ただ、パラメータ部分はいろいろ意見があってまとまっていないです。
上記の他に、`to=top`とか`go=down`など。

※ なお、原理主義者の方曰く「GETする意味のないものはリソースとして相応しくない」とのこと。

## 実装編

さて、これをどうやって実装するか、までは議論していなかったので、ここに続きを書いてみます。

まず`move_to_bottom`は冪等(べきとう)であるため`PUT`での実行が望ましいです。Rails4では`PATCH`も利用できるのでそれでも良いでしょう。

`move_higher`は実行後のリソースの状態が冪等ではないため`POST`として実行させます。

※ 冪等については[こちらの記事](http://d.hatena.ne.jp/tkawa/20120325/p1)を参照のこと。

``` ruby

#routes.rb

resources :todo_lists, shallow: true do
  resources :todo_items do
    resource :position, only: [:create, :update]
  end
end
```

`routes.rb`で`shallow: true`しているので、実際のURLはこんな感じですね。

```

PUT  /todo_items/2/position
```

次にコントローラ。

``` ruby

class PositionsController < ApplicationController
  # remote: true なアクセスを想定
  # 例： link_to 'higher', todo_item_position_path(todo_item, move: 'higher'), remote: true
  respond_to :js, :json

  # POST /todo_items/2/position?move=higher|lower
  # render create.js.erb or create.json.jbuilder or json: @chapter_article
  def create
    case params[:move]
    when 'higher' then @chapter_article.move_higher
    when 'lower' then @chapter_article.move_lower
    end
  end

  # PATCH/PUT /todo_items/2/position?move=top|bottom
  # render update.js.erb or update.json.jbuilder or json: @chapter_article
  def update
    case params[:move]
    when 'top' then @chapter_article.move_to_top
    when 'bottom' then @chapter_article.move_to_bottom
    end
  end
end
```
うう、、これは分ける必要があるのか？悩ましい。

## 所感

ともあれ、まあこんな塩梅で作っておけば問題は無さそうですね。
テストも書きやすいですし。

ただ`acts_as_list`使うたびに`PositionsController`を作成するのは面倒そう。
どうせなら、[Engie](http://guides.rubyonrails.org/engines.html)使ってgemにすると良いですね。

それと`remote: true`のときに何をレンダリングさせるか、どうやってViewをレンダリングするか、ってのも最近気になってることに気づいた。
これも後で書きたい。

## 参考情報

[RailsのURL設計を考えてみる(7) リスト操作](http://d.hatena.ne.jp/tkawa/20130220/p1)


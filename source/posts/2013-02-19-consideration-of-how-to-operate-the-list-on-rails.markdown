---
title: "ActsAsListによるリスト操作に関する考察"
date: 2013-02-19 21:30
comments: true
tags: [ruby, rails, design]
---

**UPDATE:** [続きを書きました](/posts/2013/02/25/move-position-resources-best-practices/)

READMORE

[swanandp / acts_as_list - Github](https://github.com/swanandp/acts_as_list)

リスト操作といえば昔からActsAsListが定番ですが、「上に移動」「下に移動」のリクエストをどのようなURLで実行していますか？

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

モデルの操作についてはREADMEにある通り、誰も迷わないと思います。

しかし、これらを実行するコントローラ、或いは、RESTメソッド的には、どう作るのが最適なのか。
コレが今日の問題です。

きっとこのサンプルなら、まずは以下の様なルーティングで問題ないでしょう。
``` ruby

#routes.rb
resources :todo_lists, shallow: true do
  resources :todo_items
end
```

**問題は、`move_higher`や`move_to_bottom`を呼び出すコントローラのメソッドどのように割り当てるか**、です。

私は以下のように書くのが正解かな、と考えています。
``` ruby

#routes.rb
resources :todo_lists, shallow: true do
  resources :todo_items do
    member do
      put :bottom
      post :higher
    end
  end
end
```

さて、なぜか。少しだけ解説します。

## PUT :bottom は、何度実行しても同じ結果となるべき

`PUT`はREST厨的に言えば「何度実行しても同じ結果になる操作」なわけです。（たしか）

よって、前述の`move_to_bottom`を実行するコントローラのメソッドは`PUT`であるべきだと考えました。

### なんでメソッド名は`bottom`だけ？

REST神曰く。

「メソッド名に動詞を含む事なかれ。動詞は既に`PUT`というカタチで表現されている。」

今回、`todo_item`には順序しか無いのでこれで良しとしています。
**ただし、この`todo_item`に「優先順位」などという項目があったときには、もう一捻りする必要があります**ね。

`bottom`だけでは「順序を一番下に持っていく」のか「優先順位を最後にする」のかわからなくなりますから。

## move_higher は、実行するたびに結果が変わる故、`POST`

本当ならリソースの更新なので、ここも`PUT`にしたいところです。残念なことに、１つずつ順序が変わる`move_higher`ですから、`PUT`の原則が適用できません。

なので、仕方がないので`POST`みたいな感じです。

### なんでメソッド名は`higher`だけ？

REST神曰く(ry

## 所感

ぶっちゃけ`post :move_to_bottom`, `post :move_higher` というメソッドでも悪く無いとは思います。
原理主義者では無いので。しかし、まあ、規約大事ということで。

ここらへんは**いろんな流派があって、賛否が別れるとは思います**が「ここって何か釈然としない」と常々思っておりまして、これで一応の解決を図ることができると思っております。(自分の中で)




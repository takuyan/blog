---
title: "Railsの項目ごとの初期値はdefault_value_forが良さそう"
date: 2013-02-18 13:00
comments: true
categories: [ruby, rails]
---

## 初期値の設定

皆さんは「初期データ」ってどのように設定していますか。
「初期値って、そりゃDB側に設定するでしょう」という声も聞こえてきますが「親レコードの指定された値」だとか、更にそれを計算した値、となるとDB側で対応するのが正解とは言い難くなってきます。

そこで、私はよく`before_filter :set_default`などと書いていました。
しかし、最近にしてやっと`default_value_for`というGemがあることを知りまして目鱗しております。

[FooBarWidget / default_value_for](https://github.com/FooBarWidget/default_value_for)

``` ruby
class User < ActiveRecord::Base
  default_value_for :name, "(no name)"
  default_value_for :last_seen do
    Time.now
  end
end

u = User.new
u.name       # => "(no name)"
u.last_seen  # => Mon Sep 22 17:28:38 +0200 2008
```

初期データの設定まわりは、不具合になりやすい割に、気づきヅライという問題がありますね。
そこをこの`default_value_for`で解決できるととても嬉しいなぁと思いました。



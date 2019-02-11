---
title: "awesome_nested_setを導入したら最初にrebuild!しよう"
date: 2012-12-21 14:22
comments: true
tags: [rails, ruby, gem]
---

ツリー構造を表現するGemとして、 [awesome_nested_set](https://github.com/collectiveidea/awesome_nested_set) があります。
`has_many`ではなく、親子関係を持たせたい時に使っています。

## 簡単な使い方

``` ruby
# Create a root node:
science = Category.create!(name: 'Science')

# Put a new thing inside this root node:
physics = Category.create!(name: 'Physics')
physics.move_to_child_of(science)

# Put another thing inside the "physics" node:
gravity = Category.create!(name: 'Gravity')
gravity.move_to_child_of(physics)

# Reload the root node:
science.reload

# Now you should have something that resembles this:
#    science
#    '-- physics
#        '-- gravity
```

詳しくは [チートシート](https://github.com/collectiveidea/awesome_nested_set/wiki/Awesome-nested-set-cheat-sheet)を見てください。

## ハマりどころ

導入したら必ず `rebuild!` しましょう。

``` ruby
Category.rebuild!
```

既存のモデルにこの機能を追加した際、`rebuild!`を忘れていて、随分と無駄な時間を過ごしました。
`rebuild!`しないと`comparison of Fixnum with nil failed` などと言われ、困惑すること請け合いです。



---
title: "Haml-4.0を使うときの6つの注意点"
date: 2013-02-14 18:50
comments: true
tags: rails, ruby
thumb: /images/2013/haml.png
---

閉じタグに嫌悪感を抱く全国519万人のHamlファンの皆さんこんにちは。([ruby-toolbox調べ](https://www.ruby-toolbox.com/))

`bundle update`したらHamlが4.0になったそうです。同時に、いろんな機能追加が行われたとのこと。
「一部のアプリは動かなくなるかもしれんよ」とあったので、ここに書き写しておく。

READMORE

```

HEADS UP! Haml 4.0 has many improvements, but also has changes that may break
your application:

* Support for Ruby 1.8.6 dropped
* Support for Rails 2 dropped
* Sass filter now always outputs <style> tags
* Data attributes are now hyphenated, not underscored
* html2haml utility moved to the html2haml gem
* Textile and Maruku filters moved to the haml-contrib gem

For more info see:

http://rubydoc.info/github/haml/haml/file/CHANGELOG.md
```
### Ruby 1.8.6 サポート、やめました

諦めましょう。

### Rails 2.x サポート、やめました

諦めましょう。

### :sass filterが`<style>`タグを一緒に出力します

いままでは、こう書いたら、

``` haml

%style
  :sass
    div
      color: red
```

このようにレンダリングされてました。

``` html

<style>
  div { color: red; }
</style>
```
---

これからは、`:sass` フィルターだけで、

``` haml

:sass
  div
    color: red
```

`style`タグを含むカタチでレンダリングしてくれるとのこと。

``` html

<style>
  div { color: red; }
</style>
```

### Data attributes はアンスコでなくハイフンになりました

このように書くと、

``` haml

.foo{data: {a: "b", c: {d: "e", f: "g"}}}
```

こうなります。

``` html

<div class='foo' data-a='b' data-c-d='e' data-c-f='g'></div>
```

すごく便利そう！

### html2haml は、 html2haml というGemとして分離しました

[haml/html2haml - Github](https://github.com/haml/html2haml)

### Textile と Maruku filters は haml-contrib というGemとして分離しました

[haml/haml-contrib - Github](https://github.com/haml/haml-contrib)

## 参考文献

- [Haml 4.0 has been released!](http://blog.haml.info/post/42998475354/haml-4-0-has-been-released)
- [4.0.0 - Haml Changelog](http://haml.info/docs/yardoc/file.CHANGELOG.html#400)
- [Haml 4.0 has been released!! - 一分一秒真剣勝負！](http://yatmsu.hatenablog.com/entry/2013/02/14/Haml_4_0_has_been_released%21%21)


---
title: "ActiveRecord for Titanium"
date: 2012-08-22 22:39
tags: titanium
---

最近はTitaniumでiPhoneとかAndroidのアプリを作っています。
そこでいつもイライラするのがモデルの処理。
普段Railsやってるのもあって「Railsだったらこうできるのに」とか考えてしまいますからね。

一応、TitaniumにもMVCなフレームワークが多々あります。代表的なものに本家のAlloyとかね。
でも欲しいのはモデルの部分だけなんですね。VCは、少なくともいまはいらない。

以前、[@yagi_](https://twitter.com/yagi_)さんの作った簡易的なデータベースのラッパーがあったので、それを使って気持ちをごまかしていたのですが...

[Titanium MobileでSQLiteをDataMapperっぽく扱う](http://selfkleptomaniac.org/archives/2181)

幾つか、もどかしくなって、ActiveRecordもどきを作ってしまいました。
SQL組立部分は面倒くさいので[@yagi_](https://twitter.com/yagi_)さんのをパクって改変しました。いやほんと助かりました。

[takuyan / TiActiveRecord](https://github.com/takuyan/TiActiveRecord)

使いごこちは、ほのかにRailsのそれを感じさせることができる程度には、ActiveRecordパターンです。

## 使用例

#### 作ったり保存する

```coffeescript

a1 = Article.build
  uid: 10
  title: 'Awesome Article'
  body: 'Lorem Ipsum...'
  user_id: 8

a1.isNewRecord() # => true

a1.save()

a1.isNewRecord() # => false
```

#### 検索したり削除する

``` coffeescript

a2 = Article.find(1)

a2.id # => 1
a2.uid # => 10
a2.title # => 'Awesome Article'
a2.body # => 'Lorem Ipsum...'
a2.user_id # => 8
a2.created_at # => 2012-08-20 20:20:20
a2.updated_at # => 2012-08-20 20:20:20

a2.destroy()
```

#### createしたらnewRecordじゃないよね

``` coffeescript

a3 = Article.create
  uid: 3
  title: 'Wonderful Article'
  body: 'lorem ipsum...'
  user_id: 3

a3.isNewRecord() # => false
```

#### クラスメソッドふうに検索もしたい

``` coffeescript

articles = Article.all()

someUsersArticles = Article.find
  user_id: 1

someUsersArticles.length # => 3

Article.deleteAll
  user_id: 3
```

## モデル作成

``` coffeescript

#
# lib/models/article.coffee
# => Resources/models/article.js
#
TiActiveRecord = require 'lib/TiActiveRecord'

class Article extends TiActiveRecord

  @dbName = 'myapp'
  @tableName = 'articles'
  # @remove_auto_increment = true # If you do not need 'AUTOINCREMENT' to id, please set to true
  # @remove_primary_key = true    # If you do not need 'PRIMARY KEY' to id, please set to true
  @properties =
    uid: 'integer'
    title: 'text'
    body: 'text'
    image_url: 'text'
    image_name: 'text'
    pv: 'integer'

Article.init()

module.exports = Article
```
これだけ。（と、言いたい）

#### 拡張も楽。（と、思いたい）

``` coffeescript

#
# lib/models/article.coffee
# => Resources/models/article.js
#
TiActiveRecord = require 'lib/TiActiveRecord'

class Article extends TiActiveRecord

  @dbName = 'myapp'
  @tableName = 'articles'
  @properties =
    uid: 'integer'
    title: 'text'
    body: 'text'
    image_url: 'text'
    image_name: 'text'
    pv: 'integer'

  #
  # class method
  #
  @findAllByUserId = (userId) ->
    sql = "SELECT * FROM #{@tableName} WHERE USER_ID = ?"
    @read sql, userId

  #
  # instance method
  #
  getImageDir: ->
    imageDir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "article#{@uid}")
    unless imageDir.exists()
      imageDir.createDirectory()
    imageDir

Article.init()

module.exports = Article
```

## おわりに

とりあえずつくってみた感じです。ぜひ使ってツッコミを頂けると助かります。
( isNewRecord() ってid見てるだけとかクソじゃん、とか。 )

v0.0.1だし、テストも無いけど、どうぞよろしくお願いいたします。

[takuyan / TiActiveRecord](https://github.com/takuyan/TiActiveRecord)


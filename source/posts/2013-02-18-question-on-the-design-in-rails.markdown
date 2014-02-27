---
title: "ひとつのモデルを立場の違うユーザで閲覧する場合のベストプラクティスを探る"
date: 2013-02-18 16:00
comments: true
tags: [ruby, rails, design]
---

<img src='/images/2013/rails_way.jpg' class='img-thumbnail' />

**複数の出版社の本を管理するシステムがあり、単純に本の一覧データを閲覧したい**、という場合について考えます。

おおよそ、以下の２パターンのどちらで行くか、という話題です。

- パターン１：ひとつのコントローラですべてのビューに対応する
- パターン２：ビューごとにコントローラを作る

READMORE

### 前提条件

- `User`, `Publisher`(出版社), `PublisherUser`, `Book` のモデルがある
- `Publisher`に所属する`User`を`PublisherUser`で管理
- `User`は自分の`Book`のみ削除可能
- ログインは`User`が行う
- `User`は管理者権限がある

### 要件

- `User`に自分の`Book`一覧を閲覧可能
- `User`は`Publisher`単位で管理している`Book`一覧を閲覧可能
- `User`は所属していない`Publisher`の`Book`一覧は閲覧不可能
- 管理者権限を持つ`User`はすべての`Book`一覧を閲覧可能

### 作り方

#### パターン１：ひとつのコントローラですべてのビューに対応する

URLを同一( /books )のまま、表示をログインユーザごとに分けるというやりかたです。

`Books#index`を使いまわして、権限ごとに表示項目を変更します。
なので、view側で「削除ボタン」の表示判断をやります。

``` ruby books_controller.rb
# GET books#index
def index
  if current_user.is_admin?
    @books = Book.all
  elsif params[:publisher_id]
    @publisher = Publisher.find params[:publisher_id]
    @books = @publisher.books # <= Publisher has_many :books, through: :publisher_users な感じ。
  else
    @books = current_user.books
  end
end
```

``` haml index.html.haml
%table.table
  %thead
    %tr
      %th
        Title
      %th
        Author
      %th
        Delete
  %tbody
    - @books.each do |b|
      %tr
        %td
          = link_to b do
            = b.title
        %td
          = link_to b.user do
            = b.user.name
        %td
          - if current_user.is_author?(b) || current_user.is_admin?
            = link_to b, method: :delete, class: 'btn btn-danger' do
              %i.icon-trash
              Delete
```
権限による表示項目に大した差がない場合、この程度の修正で作る場合が多いと思います。
ただ、権限による表示項目や操作の差異が大きくなっていくと、途端にメンテナンスしづらくなっていきます。

「俺は管理者権限あるけど、自分のだけ見たい」とか言われるとアウトですね。

**まあ、ぶっちゃけ大概アウトです。**

### パターン２：ビューごとにコントローラを作る

URLで見れるものを分類するやりかた。
それぞれを以下のようにroutingします。

- ( /books ) `User`に自分の`Book`一覧を閲覧可能
- ( /publishers/:id/books ) `User`は`Publisher`単位で管理している`Book`一覧を閲覧可能
- ( /admin/books ) 管理者権限を持つ`User`はすべての`Book`一覧を閲覧可能

そんなわけで、`routing_spec`から。

``` ruby routing_specs.rb
# spec/routing/books_routing_spec.rb
require "spec_helper"

describe BooksController do
  describe "routing" do
    it "recognizes and generates #index" do
      get("/books").should route_to("books#index")
    end
  end
end

# spec/routing/publishers/books_routing_spec.rb
require "spec_helper"

describe Publishers::BooksController do
  describe "routing" do
    it "recognizes and generates #index" do
      get("/publishers/1/books").should route_to("publishers/books#index", publisher_id: '1')
    end
  end
end

# spec/routing/admin/books_routing_spec.rb
require "spec_helper"

describe Admin::BooksController do
  describe "routing" do
    it "recognizes and generates #index" do
      get("/admin/books").should route_to("admin/books#index")
    end
  end
end
```

ルーティングは以下のような感じで。
``` ruby routes.rb
Publisher::Application.routes.draw do
  resources :books
  resources :publishers do
    resources :books, module: :publishers, only: [:index]
  end
  namespace :admin do
    resources :books, only: [:index]
  end
end
```

コントローラのspecを書きます。
``` ruby controller_specs.rb
# coding: utf-8
require 'spec_helper'

describe BooksController do
  before :all do
    @user = FactoryGirl.create :user
    @user.confirm!

    @other = FactoryGirl.create :user
    @other.confirm!
  end

  before :each do
    sign_in @user
  end

  context '自分のbooks' do
    describe 'GET index' do
      before :all do
        my_book1 = FactoryGirl.create :book, user_id: @user.id
        my_book2 = FactoryGirl.create :book, user_id: @user.id
        not_my_book1 = FactoryGirl.create :book, user_id: @other.id
        not_my_book2 = FactoryGirl.create :book, user_id: @other.id
      end

      it '@booksのauthorがすべて自分であること' do
        get :index
        assigns(:books).should eq([my_book1, my_book2])
      end
    end
  end
end

# TODO あとの2つ
# ...
```

で、コントローラです。
``` ruby controllers.rb
# app/controllers/books_controller.rb
class BooksController < ApplicationController
  def index
    @books = current_user.books
  end
end

# app/controllers/publishers/books_controller.rb
class Publishers::BooksController < ApplicationController
  # 権限とか例外とかはちょっと省略
  def index
    @publisher = Publisher.find params[:publisher_id]
    @books = @publisher.books
  end
end

# app/controllers/admin/books_controller.rb
class Admin::BooksController < ApplicationController
  def index
    @books = Books.all
  end
end

```

Viewはそれぞれ以下のように配置しました。
``` sh
mkdir -p app/views/books
touch app/views/books/index.html.haml
mkdir -p app/views/publishers/books
touch app/views/publishers/books/index.html.haml
mkdir -p app/views/admin/books
touch app/views/admin/books/index.html.haml
```

## まとめ

さて、そんなわけで、最近は**URLごとにコントローラを作る**というスタイルで落ち着いています。

これは、パターン１に比べると拡張が楽なんですね。
例えば、**ユーザごとの本一覧が見たい**とかなったときでも直ぐに追加できますからね。

``` ruby routes.rb
Publisher::Application.routes.draw do
  resources :books
  resources :publishers do
    resources :books, module: :publishers, only: [:index]
  end
  namespace :admin do
    resources :books, only: [:index]
  end

  # Add This !
  resources :users do
    resources :books, module: :users, only: [:index]
  end
end
```
ただ、世の中にはもっと効率的な作り方があると思います。
だって、上記の作り方はちょっと記述量が多いような気もしますし。

※ なおサンプルコードはわりと適当です（重要）

## 最後に

「あ、こいつ、まだ練度が足りんな」とお思いのあなた。
どうか、ご指導ご鞭撻のほど、よろしくお願いいたします！

そして、初学者の方々にとって少しでもお役に立てれば、幸いです。

ひとりでRailsと向き合っていると、様々なモヤモヤにぶち当たります。
Githubなどで類似のプロジェクトを覗きつつ、様々な決断のもと、作り上げていく状態ですね。

私なりの考え方と、一応の解決策を書いてみましたが、皆さんがどうやってこれらを解決していくのかに興味があったりします。
そんなわけで、いろいろと突っ込んで頂けると嬉しいです。

[Photo By davedehetre](http://www.flickr.com/photos/davedehetre/6058277214/)


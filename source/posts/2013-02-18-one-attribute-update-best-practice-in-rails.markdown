---
title: "単一項目のみを更新するRailsパターンを探る"
date: 2013-02-18 22:12
comments: true
categories: [ruby, rails]
---

フラグの変更や、順序の変更など、項目をひとつだけ更新したいようなアクションは多いと思います。
その際、RailsやRESTの観点からどのような方法が考えられるか、検討してみます。

## お題目：記事における公開フラグ

`Article#launch`を`true`にすることで記事が公開される場合。

### パターン１：PUT update を使う

公開フラグのみの更新であっても`form`やパラメータ付きのリンク(PUT)によって、値を更新する方法。

``` haml
= form_for @article do |f|
  = f.check_box :launch, class: "checkbox"
  = f.submit 'Save', class: "btn"
```
或いは
``` haml
= link_to article_path(@article, launch: true), method: :put, class: 'btn', remote: true do
  %i.icon-ok
  公開する
```

### パターン２：専用メソッドを生やす

``` ruby routes.rb
  # config/routes.rb
  resources :articles do
    member do
      put :launch # <= Add This
    end
  end
```

``` ruby articles_controller.rb
  # app/controllers/articles_controller.rb
  def launch
    @article = Article.find params[:id]
    @article.launch!
  end
```

``` ruby article.rb
  # app/models/article.rb
  def launch!
    self.launch_flag = true
    self.save
  end
```

## 所感

パターン１は「記事の公開フラグ」の重要度が低いのであれば、アリかもしれません。

しかし「ユーザが記事を書き、管理者が記事を公開をすることで、執筆料が発生する」となると話は別ですね。

その場合はやはり、パターン２のように専用メソッドを生やし、権限を設け、ユーザからは更新できないようにするべきでしょう。
``` ruby articles_controller.rb
  before_filter :require_admin, only: [:launch]
  def launch
    @article = Article.find params[:id]
    @article.launch_by! current_user
  end
```

``` ruby article.rb
  attr_protected :launch_flag
  def launch_by! user
    if user.is_admin?
      self.launch_flag = true
      self.save
    else
      self.errors.add :permission_deny, 'require admin role'
    end
  end
```

また、`PUT`メソッドを使うべきは「何度実行しても同様の結果になる」場合です。
よって「公開/下書き」をトグルで扱う場合には`POST`とするべきでしょう。

``` ruby routes.rb
  resources :articles do
    member do
      post :launch_toggle # <= Add This
    end
  end
```

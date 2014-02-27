---
title: "ルーティング for Devise 2.1"
date: 2012-09-06 8:30
tags: rails
---

DeviseといえばRailsにおける[代表的な認証ライブラリ](https://www.ruby-toolbox.com/categories/rails_authentication)です。
バージョンアップに伴いログアウト部分に修正が必要になりました。

READMORE

## 修正前はこんなエラーが発生

``` ruby
# viewでdestroy_user_session_pathが使えなくなりました (ﾟДﾟ)ｺﾞﾙｧ！
<%= link_to "ログアウト", destroy_user_session_path %>

# => The action 'sign_out' could not be found for UsersController
```

## Userにおけるサンプル

``` ruby
# ==== Examples
#
# Let's say you have an User model configured to use authenticatable,
# confirmable and recoverable modules. After creating this inside your routes:
#
devise_for :users
#
# This method is going to look inside your User model and create the
# needed routes:
#
# Session routes for Authenticatable (default)
     new_user_session GET    /users/sign_in                    {:controller=>"devise/sessions", :action=>"new"}
         user_session POST   /users/sign_in                    {:controller=>"devise/sessions", :action=>"create"}
 destroy_user_session DELETE /users/sign_out                   {:controller=>"devise/sessions", :action=>"destroy"}

# Password routes for Recoverable, if User model has :recoverable configured
    new_user_password GET    /users/password/new(.:format)     {:controller=>"devise/passwords", :action=>"new"}
   edit_user_password GET    /users/password/edit(.:format)    {:controller=>"devise/passwords", :action=>"edit"}
        user_password PUT    /users/password(.:format)         {:controller=>"devise/passwords", :action=>"update"}
                      POST   /users/password(.:format)         {:controller=>"devise/passwords", :action=>"create"}

# Confirmation routes for Confirmable, if User model has :confirmable configured
new_user_confirmation GET    /users/confirmation/new(.:format) {:controller=>"devise/confirmations", :action=>"new"}
    user_confirmation GET    /users/confirmation(.:format)     {:controller=>"devise/confirmations", :action=>"show"}
                      POST   /users/confirmation(.:format)     {:controller=>"devise/confirmations", :action=>"create"}
```

[from github](https://github.com/plataformatec/devise/blob/master/lib/devise/rails/routes.rb#L30)

`destroy_user_session`があるのに使えないとかドツボに嵌りそうですね。

ひとまず以下の様な修正をすることでログアウトの問題を修正します。

``` ruby
devise_for :users
devise_scope :user do
  delete '/logout' => 'devise/sessions#destroy', as: :logout
  end
```

## カスタマイズ

また、以前は`devise_for :resources do ... end`で色々なカスタマイズができましたが、非推奨となり、代わりに`devise_scope`を使うよう推奨されています。

## Devise 2.1 はじまってました

[How to: upgrade to devise 2.1](https://github.com/plataformatec/devise/wiki/How-To:-Upgrade-to-Devise-2.1)


## Deviseおすすめリンクまとめ

[http://devise.plataformatec.com.br/](http://devise.plataformatec.com.br/)

plataformatecの公式サイトのようである。

[How To: Upgrade to Devise 2.0](https://github.com/plataformatec/devise/wiki/How-To:-Upgrade-to-Devise-2.0)

[migrationに関する変更点](https://github.com/plataformatec/devise/wiki/How-To:-Upgrade-to-Devise-2.0-migration-schema-style)



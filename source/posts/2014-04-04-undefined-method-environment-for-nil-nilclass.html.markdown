---
title: undefined method environment for nil:NilClass
date: 2014-04-04 15:19 JST
tags: rails, error
thumb: /images/2014/undefined_method_environment_for_nil_NilClass.png
---

Railsを4.0.4にしたらエラーに遭遇。  
`application.css.sass`がおかしいとか言われる。  
そんなバカな。

``` ch
NoMethodError - undefined method `environment' for nil:NilClass
  (in /Users/takuyan/rails/scrum/app/assets/stylesheets/application.css.sass):
```

READMORE

ググってみると`sass-rails`と`sprocket`のバージョンの問題ぽい。

[undefined method environment for nil:NilClass when importing Bootstrap](http://stackoverflow.com/questions/22392862/undefined-method-environment-for-nilnilclass-when-importing-bootstrap)

なのでGemfileを書き換えて対応しましょう。

``` ruby
gem 'sass-rails', '~> 4.0.2'
```

で`bundle update sass-rails`と。  
とりあえずはこれで何とかなった。  

お疲れ様です。

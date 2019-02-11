---
title: "rbenvがあればCapistranoのbundle:installでdeploymentはいらない"
date: 2012-11-01 19:54
comments: true
tags: [rails, ruby]
---

Railsで開発していて、デプロイはcapistranoを使い、本番環境でrbenvを使ってる皆様こんにちは。
そのような皆様の`config/deploy.rb` に以下のような記述があると思います。

READMORE

```  ruby
require "bundler/capistrano"
set :default_environment, {
  'RBENV_ROOT' => '$HOME/.rbenv',
  'PATH' => "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH"
}
set :bundle_flags, "--quiet --binstubs --shebang ruby-local-exec"
```

この、`bundle_flags` ですが、デフォでは `--deployment --quiet` という値が設定されています。
`--deployment` ってなんなの。デプロイするんだから、必要だよね？とか思っていたけど、これは不要ですよ、というお話です。

## bundle install --deployment

`--deployment` は、自分が管理権限を持たないサーバに対してデプロイする場合、`bundle install`しても`permission error`で`gem`をインストールできないので、プロジェクト直下に`vendor`ディレクトリを作ってそこに`gem`をインストールしようぜ、というアプローチです。

よって、管理権限があるなら不要です。更に、`rbenv`をインストールしておくと、デプロイユーザごとに`gem`をインストールできますね。
これにより、更に`--deployment`の必要がなくなります。

つまり、本番環境で`rbenv`使っている人は、`config/deploy.rb` では上記のようにすると良いでしょう、ということでした。

## まとめ

レンタルサーバなどで管理権限なくて、rbenvも導入してない場合に限り、`--deployment` フラグを使うとよいでしょう。それ以外は使う必要なし。

``` ruby
# :bundle_flags には --deployment が初期設定されているから、上書きする
set :bundle_flags, "--quiet --binstubs --shebang ruby-local-exec"
```

あー、すっきりした。

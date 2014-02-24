---
title: "rbenv install 2.0.0-preview1とopenssl"
date: 2012-11-21 20:03
comments: true
categories: [ruby, rbenv]
---

`rbenv install 2.0.0-preview1`はうまくいくものの、`bundle install`で`openssl`のエラーが出ました。

[sstephenson/ruby-build](https://github.com/sstephenson/ruby-build) のIssuesに答えがあったのでメモ。

``` sh
brew update
brew install openssl
export CONFIGURE_OPTS="--with-openssl-dir=`brew --prefix openssl`"
rbenv install 2.0.0-preview1
rbenv rehash
```

> https://github.com/sstephenson/ruby-build/issues/197

これで勝つる。

``` sh
cd ~/your/app/path
rbenv local 2.0.0-preview1
gem install bundler
bundle install # => OK
```

以上

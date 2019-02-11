---
title: "omniauth-google-oauth2でハマったメモ"
date: 2013-06-14 12:02
comments: true
tags: rails
---

## 目的

* Google AnalyticsをAPI経由で操作したい。
* そのため、まずはGoogleへOAuth2で認可を頂く必要がある。

今回はOAuthまわりでハマったのでメモ。

READMORE

## やりかた

* Omniauth で GoogleにOAuth2

[omniauth-google-oauth2](https://github.com/zquestz/omniauth-google-oauth2) という[omniauth]()のGoogle版ストラテジーがあります。
使い方は単純で以下のとおり。

1. [Google API Console](https://code.google.com/apis/console/)にプロジェクト登録する
2. ClientIDとClient Secretをゲット
3. gemをGemfileに追加
4. ファイル config/initializers/omniauth.rb を追加しClientID/Secretを入力
5. config/routes.rb にいろいろ追加
6. app/controllers/oauth_controller.rb とか作る

前半部分は[Google公式](https://developers.google.com/accounts/docs/OAuth2?hl=ja)を読んでください。
後半部分は[omniauth-google-oauth2](https://github.com/zquestz/omniauth-google-oauth2)を読むといいです。

で、`config/initializers/omniauth.rb`の設定項目でヘマをしたんです。

### config/initializers/omniauth.rb

で、私はGoogleAnalyticsやりたかったので`scope`を以下のように設定してました。これがまずかった。

``` ruby
#invalid_omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, 'your_cliant_id', 'your_client_secret',
    {
      scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }
end
```

ちなみにファイル名は任意ですよ。

## insufficientPermissions ??

``` json
{"errors"=>[{"domain"=>"global", "reason"=>"insufficientPermissions", "message"=>"Insufficient Permission"}], "code"=>403, "message"=>"Insufficient Permission"}:
{
 "error": {
  "errors": [
   {
    "domain": "global",
    "reason": "insufficientPermissions",
    "message": "Insufficient Permission"
   }
  ],
  "code": 403,
  "message": "Insufficient Permission"
 }
}
```

何かが足らないらしい。

## scope デフォ要素が足りない

> The `userinfo.email` and `userinfo.profile` scopes are used by default. By defining your own scope, you override these defaults. If you need these scopes, don't forget to add them yourself!

ちゃんと[README](https://github.com/zquestz/omniauth-google-oauth2)に書いてあるんですが、これまた見落としてました。
`userinfo.email`と`userinfo.profile`は追加しましょうね。

``` ruby
#valid_omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, 'your_cliant_id', 'your_client_secret',
    {
      scope: 'userinfo.email,userinfo.profile,https://www.googleapis.com/auth/analytics.readonly'
    }
end
```

## 結論

ちゃんとREADME嫁。

## refresh_tokenに関する追記

> `approval_prompt`: Determines whether the user is always re-prompted for consent. It's set to `force` by default so a user sees a consent page even if he has previously allowed access a given set of scopes. Set this value to `auto` so that the user only sees the consent page the first time he authorizes a given set of scopes.

> `access_type`: Defaults to `offline`, so a refresh token is sent to be used when the user is not present at the browser. Can be set to `online`.

上記の`approval_prompt`と`access_type`なんですが、組み合わせ次第で`refresh_token`が発行されないようです。

### approval_prompt: auto + access_type: offline = no refresh_token

`approval_prompt`、つまり「アカウント連携するぜ、いいよな？」という画面を出すかどうかという設定項目です。
これを`auto`、つまり、一回認証したらあとはわざわざ何度も「OK」を押さなくても良い、という設定にする。

次に`access_type`、つまり「実際ブラウザでアプリケーションを開いていない状態でもGoogleアカウントにアクセスできるかどうか」という設定項目です。
これを`offline`にするとユーザがアクセスせずとも「裏側」でGoogleへアクセスすることができます。

さて、この`approval_prompt: auto + access_type: offline`という組み合わせを使うと`refresh_token`が発行されないようです。
まあ確かに「一度認証されたのだから無期限にユーザのあずかり知らぬ所でアクセス可能としろ」というわけなので、そこまでの乱暴ぶりは許さないということでしょうか。

``` ruby
#valid_omniauth.rb
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :google_oauth2, 'your_cliant_id', 'your_client_secret',
    {
      scope: 'userinfo.email,userinfo.profile,https://www.googleapis.com/auth/analytics.readonly'
    }
end
```

### 追記

もしかしたら、二段階認証を設定しているユーザも同様に`refresh_token`をもらえないです、いまのところ。


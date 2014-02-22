---
title: "Paperclip with factory_girl on Rspec"
date: 2012-12-27 21:36
comments: true
categories: [rails, ruby, paperclip, factory_girl]
---

今日は`Paperclip`なモデルをRspecでテストする際の注意事項についてメモ。

## PaperclipとFactoryGirl

言わずもがな、[Paperclip](https://github.com/thoughtbot/paperclip)は、ファイルをアップロードするためのgemです。

``` ruby
# app/models/user.rb
class User < ActiveRecord::Base
  attr_accessible :avatar
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }
end
```

同様に[FactoryGirl](https://github.com/thoughtbot/factory_girl)は、所謂fixture replacementのgemですね。

``` ruby
# This will guess the User class
FactoryGirl.define do
  factory :user do
    first_name "John"
    last_name  "Doe"
    admin false
  end

  # This will use the User class (Admin would have been guessed)
  factory :admin, class: User do
    first_name "Admin"
    last_name  "User"
    admin      true
  end
end
```

## Paperclip::Shoulda::Matchers

`paperclip`には独自のvalidationが幾つかありますが、それらを`rspec`で検証する際、この[Paperclip::Shoulda::Matchers](http://rubydoc.info/gems/paperclip/Paperclip/Shoulda/Matchers)を使います。

使い方は次の通り。

``` ruby
# spec/spec_helper.rb
require "paperclip/matchers"

RSpec.configure do |config|
  #
  # etc...
  #

  # 追加
  config.include Paperclip::Shoulda::Matchers
end
```

上記の設定をすると、下記の通り、`validation`のテストが簡単に書くことができます。

``` ruby
describe User do
  it { should have_attached_file(:avatar) }
  it { should validate_attachment_presence(:avatar) }
  it { should validate_attachment_content_type(:avatar).
                allowing('image/png', 'image/gif').
                rejecting('text/plain', 'text/xml') }
  it { should validate_attachment_size(:avatar).
                less_than(2.megabytes) }
end
```

TextUnitを使った場合などは、以下からご確認くださいませ。

### 参考

[rubydoc.info/gems/paperclip/Paperclip/Shoulda/Matchers](http://rubydoc.info/gems/paperclip/Paperclip/Shoulda/Matchers)

## fixture_file_upload

添付ファイルのテストをしたい場合に`fixture_file_upload`を使うのですが、その際、以下のように設定を施しましょう。

``` ruby
# spec/factories/users.rb
include ActionDispatch::TestProcess # 追加

FactoryGirl.define do
  factory :user do
    name 'Takuya Kato'
    avatar { fixture_file_upload("#{Rails.root}/spec/files/rails.png", "image/png") }
  end
end
```

私の場合、保存先にAWS S3を使っているせいか、体感速度がとっても遅いのがネックです。
テストだけローカルの保存する(?)とか、何か他に上手な方法がないか探しているので、知っている方は教えて頂けると嬉しいです。

### 参考

- [ActionDispatch::TestProcess](http://api.rubyonrails.org/classes/ActionDispatch/TestProcess.html)
- [Factory with carrierwave upload field](http://stackoverflow.com/questions/5990835/factory-with-carrierwave-upload-field)
- [Making the Factory Girl to support Paperclip](http://orbanbotond.blogspot.jp/2011/06/making-factory-girl-to-support.html)


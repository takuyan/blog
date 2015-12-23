---
title: マーケターの味方 rack-tracker でWebTrackingを前に進めよう
date: 2015-12-23 22:55 JST
tags: ruby
thumb: https://upload.wikimedia.org/wikipedia/commons/a/a0/World_map_with_points.svg
thumb_by: Domaina
thumb_link: https://commons.wikimedia.org/wiki/Maps_of_the_world#/media/File:World_map_with_points.svg
---

最近はマーケティング部でエンジニアをしている加藤です。  

この記事は<a href='http://qiita.com/advent-calendar/2015/moneyforward'>MoneyForward Advent Calendar 2015</a>の９日目（えっ？）の記事です。

私はもっぱらRubyでコードを書いていましたが、しばしばマーケティング方面の方々から「リスティング、アフィリエイト、リターゲティング、行動分析などのタグをいろんな場所において欲しい」という要望が稀によくあります。

いままで、やっつけ仕事感覚で`partial`として書くことが多かったのですが最近知った`rack-tracker`という`rack middleware`が便利だったのでご紹介。

READMORE

## Usage

<a href='https://github.com/railslove/rack-tracker' target='_blank'>rack-tracker</a>はrack-middleware
google-analyticsのみならず、色々なtagが出力できる

こんな感じで設定すると

```ruby
config.middleware.use(Rack::Tracker) do
  handler :google_analytics, { tracker: 'U-XXXXX-Y' }
end
````

各ページに、こんな感じで出力されます。


```html
<script type="text/javascript">
  if(typeof ga === 'undefined') {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'U-XXXXX-Y', {});
  }
  ga("send",{"hitType":"event","eventCategory":"link","eventAction":"click","eventLabel":"top_right","eventValue":"1"});
  ga('send', 'pageview', window.location.pathname + window.location.search);
</script>
```

詳しくは<a href='https://github.com/railslove/rack-tracker/blob/master/README.md' target='_blank'>README</a>をみてもらうのが良いかと。

## どうやってるのか？

`rack-middleware`ですし、基本的な構えはrackのresponseを上書きする感じ。

```ruby
  # lib/rack/tracker.rb
  def call(env)
    @status, @headers, @body = @app.call(env)
    return [@status, @headers, @body] unless html?
    response = Rack::Response.new([], @status, @headers)

    env[EVENT_TRACKING_KEY] ||= {}

    if session = env["rack.session"]
      env[EVENT_TRACKING_KEY].deep_merge!(session.delete(EVENT_TRACKING_KEY) || {}) { |key, old, new| Array.wrap(old) + Array.wrap(new) }
    end

    if response.redirection? && session
      session[EVENT_TRACKING_KEY] = env[EVENT_TRACKING_KEY]
    end

    @body.each { |fragment| response.write inject(env, fragment) } # <= ここ
    @body.close if @body.respond_to?(:close)

    response.finish
  end
```

この`inject`でナンカしてる。

```ruby
  # lib/rack/tracker.rb
  def inject(env, response)
    @handlers.each(env) do |handler|
      response.sub! %r{</#{handler.position}>} do |m|
        handler.render << m.to_s
      end
    end
    response
  end
```

`</#{handler.position}>`の位置で`sub!`してる。つまりreplaceしてる。  
内容は`handler.render`した内容を`</#{handler.position}>`の手前に追記している。なるほど。

んで`handler`が<a href='https://github.com/railslove/rack-tracker/blob/master/lib/rack/tracker/handler.rb'>こちら</a>。

```ruby
# lib/rack/tracker/handler.rb
class Rack::Tracker::Handler
  class_attribute :position
  self.position = :head

  attr_accessor :options
  attr_accessor :env

  # Allow javascript escaping in view templates
  include Rack::Tracker::JavaScriptHelper

  def initialize(env, options = {})
    self.env = env
    self.options  = options
    self.position = options[:position] if options.has_key?(:position)
  end

  def events
    events = env.fetch('tracker', {})[self.class.to_s.demodulize.underscore] || []
    events.map{ |ev| "#{self.class}::#{ev['class_name']}".constantize.new(ev.except('class_name')) }
  end

  def render
    raise NotImplementedError.new('needs implementation')
  end

  def self.track(name, event)
    raise NotImplementedError.new("class method `#{__callee__}` is not implemented.")
  end
  end
```

`raise NotImplementedError.new('needs implementation')`とあるので、コレを継承して各々のtrackerを作る様子。  
で、このgemは<a href='https://github.com/railslove/rack-tracker/blob/master/README.md#rationale' target='_blank'>色々なタグの出力に対応している</a>んだけど、この`handler`を継承して色々作ることで実現している。

Google Tag Managerで殆ど対応できる気もするけど、自前にモノも<a href='https://github.com/railslove/rack-tracker/blob/master/README.md#custom-handlers' target='blank'>割と簡単に作れて</a>ヨサソウ。

## 本質的でないコードはなるべくRails外に出そう

こういうトラッキングだとかログとかそういうものはどんどんRailsの外にだすべきだよねって思いました。

現場からは以上です。

photo by <a href='https://commons.wikimedia.org/wiki/Maps_of_the_world#/media/File:World_map_with_points.svg' target='blank'>&copy; Domaina</a>

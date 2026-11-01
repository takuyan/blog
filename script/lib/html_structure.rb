require 'nokogiri'

module HtmlStructure
  def self.verify!(text, path)
    # DOM parsers repair duplicate document tags, so inspect the source first.
    markup = text.gsub(/<!--.*?-->|<(script|style)\b[^>]*>.*?<\/\1\s*>/mi, '')
    patterns = { 'doctype' => /<!doctype\s+html\b[^>]*>/i }
    %w[html head body].each do |tag|
      patterns[tag] = /<#{tag}(?:\s[^>]*)?>/i
      patterns["/#{tag}"] = /<\/#{tag}\s*>/i
    end
    patterns.each do |name, pattern|
      raise "#{path}: expected one #{name}, found #{markup.scan(pattern).length}" unless markup.scan(pattern).length == 1
    end
    doc = Nokogiri::HTML(text)
    ['head > title', '.navbar', '#site-navigation', '.header > h1, .page_title > h1', '#footer', 'script[src="/javascripts/application.js"]'].each do |selector|
      raise "#{path}: expected one #{selector}" unless doc.css(selector).length == 1
    end
    title = doc.at_css('title').text.strip
    heading = doc.at_css('.header > h1, .page_title > h1').text.gsub(/\s+/, ' ').strip
    raise "#{path}: HTML leaked into title" if title.match?(/<[^>]+>/)
    raise "#{path}: empty title/header" if title.empty? || heading.empty?
    expected = if path.end_with?('about/index.html')
      ['About Me - blog.takuyan.com', 'About Me']
    elsif path.end_with?('error.html')
      ['404 Page Not Found - blog.takuyan.com', '404 ページがみつかりません']
    elsif (match = path.match(%r{posts/tags/([^/]+)/(?:page/\d+/)?index\.html\z}))
      tag = heading.delete_prefix('/').delete_suffix('/')
      raise "#{path}: incorrect tag heading" unless heading == "/#{tag}/" && tag.tr('_', '-') == match[1]
      ["#{tag} - blog.takuyan.com", "/#{tag}/"]
    end
    if expected
      raise "#{path}: incorrect title/header" unless [title.gsub(/\s+/, ' '), heading] == expected
    end
    # A duplicated body can be valid HTML: check article/section identities too.
    %w[.article_info .not_found].each do |selector|
      bodies = doc.css(selector).map { |node| node.to_html }
      raise "#{path}: repeated #{selector}" unless bodies.uniq.length == bodies.length
    end
    if doc.at_css('article')
      raise "#{path}: repeated article body" unless doc.css('article').length == 1 && doc.css('article > .article_body').length == 1
    end
    headings = doc.css('h2, h3').map { |node| node.text.gsub(/\s+/, ' ').strip }
    if path.end_with?('about/index.html')
      %w[Takuya\ Kato Personal\ Projects Contact].each do |label|
        raise "#{path}: repeated/missing section #{label}" unless headings.count(label) == 1
      end
    end
    doc
  end
end

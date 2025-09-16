source "https://rubygems.org"
Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
gem "minima"
gem "jekyll-theme-hacker"

# Plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
end

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]

gem "http_parser.rb", "~> 0.8.0", :platforms => [:jruby]

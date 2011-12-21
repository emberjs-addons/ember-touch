require "bundler/setup"
require "sproutcore"
require "erb"
require "uglifier"

LICENSE = File.read("generators/license.js")

## Some SproutCore modules expect an exports object to exist. Until bpm exists,
## just mock this out for now.

module SproutCore
  module Compiler
    class Entry
      def body
        "\n(function(exports) {\n#{@raw_body}\n})({});\n"
      end
    end
  end
end

## HELPERS ##

def strip_require(file)
  result = File.read(file)
  result.gsub!(%r{^\s*require\(['"]([^'"])*['"]\);?\s*$}, "")
  result
end

def strip_sc_assert(file)
  result = File.read(file)
  result.gsub!(%r{^(\s)+sc_assert\((.*)\).*$}, "")
  result
end

def uglify(file)
  uglified = Uglifier.compile(File.read(file))
  "#{LICENSE}\n#{uglified}"
end

SproutCore::Compiler.intermediate = "tmp/intermediate"
SproutCore::Compiler.output       = "tmp/static"

def compile_package_task(package)
  js_tasks = SproutCore::Compiler::Preprocessors::JavaScriptTask.with_input "packages/#{package}/lib/**/*.js", "."
  SproutCore::Compiler::CombineTask.with_tasks js_tasks, "#{SproutCore::Compiler.intermediate}/#{package}"
end

namespace :ember do
    task :touch => compile_package_task("ember-touch")
end

task :build => ["ember:touch"]

file "dist/ember-touch.js" => :build do
  puts "Generating ember-touch.js"

  mkdir_p "dist"

  File.open("dist/ember-touch.js", "w") do |file|
    file.puts strip_require("tmp/static/ember-touch.js")
  end
end

# Minify dist/ember-touch.js to dist/ember-touch.min.js
file "dist/ember-touch.min.js" => "dist/ember-touch.js" do
  puts "Generating ember-touch.min.js"
  
  File.open("dist/ember.prod.js", "w") do |file|
    file.puts strip_sc_assert("dist/ember-touch.js")
  end

  File.open("dist/ember-touch.min.js", "w") do |file|
    file.puts uglify("dist/ember-touch.js")
  end
end


SC_VERSION = File.read("VERSION").strip

desc "bump the version to the specified version"
task :bump_version, :version do |t, args|
  version = args[:version]

  File.open("VERSION", "w") { |file| file.write version }

  # Bump the version of subcomponents required by the "umbrella" ember
  # package.
  contents = File.read("packages/ember-touch/package.json")
  contents.gsub! %r{"ember-(\w+)": .*$} do
    %{"ember-#{$1}": "#{version}"}
  end

  File.open("packages/ember-touch/package.json", "w") do |file|
    file.write contents
  end

  # Bump the version of each component package
  Dir["packages/ember*/package.json", "package.json"].each do |package|
    contents = File.read(package)
    contents.gsub! %r{"version": .*$}, %{"version": "#{version}",}
    contents.gsub! %r{"(ember-?\w*)": [^\n\{,]*(,?)$} do
      %{"#{$1}": "#{version}"#{$2}}
    end

    File.open(package, "w") { |file| file.write contents }
  end

  sh %{git add VERSION package.json packages/**/package.json}
  sh %{git commit -m "Bump version to #{version}"}
end

## STARTER KIT ##

namespace :starter_kit do
  ember_output = "tmp/touch-starter-kit/js/libs/ember-touch-#{SC_VERSION}.js"
  ember_min_output = "tmp/touch-starter-kit/js/libs/ember-touch-#{SC_VERSION}.min.js"

  task :pull => "tmp/touch-starter-kit" do
    Dir.chdir("tmp/touch-starter-kit") do
      sh "git pull origin master"
    end
  end

  task :clean => :pull do
    Dir.chdir("tmp/touch-starter-kit") do
      rm_rf Dir["js/libs/ember*.js"]
    end
  end

  task "dist/touch-starter-kit.#{SC_VERSION}.zip" => ["tmp/touch-starter-kit/index.html"] do
    mkdir_p "dist"

    Dir.chdir("tmp") do
      sh %{zip -r ../dist/touch-starter-kit.#{SC_VERSION}.zip touch-starter-kit -x "touch-starter-kit/.git/*"}
    end
  end

  task ember_output => ["tmp/touch-starter-kit", "dist/ember-touch.js"] do
    sh "cp dist/ember-touch.js #{ember_output}"
  end

  task ember_min_output => ["tmp/touch-starter-kit", "dist/ember-touch.min.js"] do
    sh "cp dist/ember-touch.min.js #{ember_min_output}"
  end

  file "tmp/touch-starter-kit" do
    mkdir_p "tmp"

    Dir.chdir("tmp") do
      sh "git clone git://github.com/ember/starter-kit.git -b ember-touch touch-starter-kit"
    end
  end

  file "tmp/touch-starter-kit/index.html" => [ember_output, ember_min_output] do
    index = File.read("tmp/touch-starter-kit/index.html")
    index.gsub! %r{<script src="js/libs/ember-touch-\d\.\d.*</script>},
      %{<script src="js/libs/ember-touch-#{SC_VERSION}.min.js"></script>}

    File.open("tmp/touch-starter-kit/index.html", "w") { |f| f.write index }
  end

  task :index => "tmp/touch-starter-kit/index.html"

  desc "Build the ember Touch starter kit"
  task :build => "dist/touch-starter-kit.#{SC_VERSION}.zip"
end

desc "Clean build artifacts from previous builds"
task :clean do
  sh "rm -rf tmp && rm -rf dist"
end

task :default => ["dist/ember-touch.min.js"]


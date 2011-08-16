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

namespace :sproutcore do
    task :touch => compile_package_task("sproutcore-touch")
    task :acceleratedeffects => compile_package_task("accelerated-effects")
end

task :build => ["sproutcore:touch","sproutcore:acceleratedeffects"]

file "dist/sproutcore-touch.js" => :build do
  puts "Generating sproutcore-touch.js"

  mkdir_p "dist"

  File.open("dist/sproutcore-touch.js", "w") do |file|
    file.puts strip_require("tmp/static/accelerated-effects.js")
    file.puts strip_require("tmp/static/sproutcore-touch.js")
  end
end

# Minify dist/sproutcore-touch.js to dist/sproutcore-touch.min.js
file "dist/sproutcore-touch.min.js" => "dist/sproutcore-touch.js" do
  puts "Generating sproutcore-touch.min.js"
  
  File.open("dist/sproutcore.prod.js", "w") do |file|
    file.puts strip_sc_assert("dist/sproutcore-touch.js")
  end

  File.open("dist/sproutcore-touch.min.js", "w") do |file|
    file.puts uglify("dist/sproutcore-touch.js")
  end
end


SC_VERSION = File.read("VERSION").strip

desc "bump the version to the specified version"
task :bump_version, :version do |t, args|
  version = args[:version]

  File.open("VERSION", "w") { |file| file.write version }

  # Bump the version of subcomponents required by the "umbrella" sproutcore
  # package.
  contents = File.read("packages/sproutcore-touch/package.json")
  contents.gsub! %r{"sproutcore-(\w+)": .*$} do
    %{"sproutcore-#{$1}": "#{version}"}
  end

  File.open("packages/sproutcore-touch/package.json", "w") do |file|
    file.write contents
  end

  # Bump the version of each component package
  Dir["packages/sproutcore*/package.json", "package.json"].each do |package|
    contents = File.read(package)
    contents.gsub! %r{"version": .*$}, %{"version": "#{version}",}
    contents.gsub! %r{"(sproutcore-?\w*)": [^\n\{,]*(,?)$} do
      %{"#{$1}": "#{version}"#{$2}}
    end

    File.open(package, "w") { |file| file.write contents }
  end

  sh %{git add VERSION package.json packages/**/package.json}
  sh %{git commit -m "Bump version to #{version}"}
end

## STARTER KIT ##

namespace :starter_kit do
  sproutcore_output = "tmp/starter-kit/js/libs/sproutcore-touch-#{SC_VERSION}.js"
  sproutcore_min_output = "tmp/starter-kit/js/libs/sproutcore-touch-#{SC_VERSION}.min.js"

  task :pull => "tmp/starter-kit" do
    Dir.chdir("tmp/starter-kit") do
      sh "git pull origin master"
    end
  end

  task :clean => :pull do
    Dir.chdir("tmp/starter-kit") do
      rm_rf Dir["js/libs/sproutcore*.js"]
    end
  end

  task "dist/starter-kit.#{SC_VERSION}.zip" => ["tmp/starter-kit/index.html"] do
    mkdir_p "dist"

    Dir.chdir("tmp") do
      sh %{zip -r ../dist/starter-kit.#{SC_VERSION}.zip starter-kit -x "starter-kit/.git/*"}
    end
  end

  task sproutcore_output => ["tmp/starter-kit", "dist/sproutcore-touch.js"] do
    sh "cp dist/sproutcore-touch.js #{sproutcore_output}"
  end

  task sproutcore_min_output => ["tmp/starter-kit", "dist/sproutcore-touch.min.js"] do
    sh "cp dist/sproutcore-touch.min.js #{sproutcore_min_output}"
  end

  file "tmp/starter-kit" do
    mkdir_p "tmp"

    Dir.chdir("tmp") do
      sh "git clone git://github.com/sproutcore/starter-kit.git -b sproutcore-touch"
    end
  end

  file "tmp/starter-kit/index.html" => [sproutcore_output, sproutcore_min_output] do
    index = File.read("tmp/starter-kit/index.html")
    index.gsub! %r{<script src="js/libs/sproutcore-touch-\d\.\d.*</script>},
      %{<script src="js/libs/sproutcore-touch-#{SC_VERSION}.min.js"></script>}

    File.open("tmp/starter-kit/index.html", "w") { |f| f.write index }
  end

  task :index => "tmp/starter-kit/index.html"

  desc "Build the SproutCore Touch starter kit"
  task :build => "dist/starter-kit.#{SC_VERSION}.zip"
end

desc "Clean build artifacts from previous builds"
task :clean do
  sh "rm -rf tmp && rm -rf dist"
end

task :default => ["dist/sproutcore-touch.min.js"]


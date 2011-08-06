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
end

task :build => ["sproutcore:touch"]

file "dist/sproutcore-touch.js" => :build do
  puts "Generating sproutcore-touch.js"

  mkdir_p "dist"

  File.open("dist/sproutcore-touch.js", "w") do |file|
    file.puts strip_require("tmp/static/sproutcore-touch.js")
  end
end

# Minify dist/sproutcore-touch.js to dist/sproutcore-touch.min.js
file "dist/sproutcore-touch.min.js" => "dist/sproutcore-touch.js" do
  puts "Generating sproutcore-touch.min.js"

  File.open("dist/sproutcore-touch.min.js", "w") do |file|
    file.puts uglify("dist/sproutcore-touch.js")
  end
end


SC_VERSION = "2.0"

task :default => ["dist/sproutcore-touch.min.js"]


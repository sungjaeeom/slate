#!/usr/bin/env bash
set -o errexit #abort if any command fails

run_build() {
  bundle exec middleman build --clean
  copy_generated_file
  echo "Completed"
}

copy_generated_file(){
  sep="/"
  echo $pDir
  target="docs"
  path=$(dirname `pwd`)$sep$pDir$sep$target

  # echo $searchdir
  # path=$(find $searchdir -name `echo '$1'`)
  echo $path
  # cp build $path/docs
  if [[ ! -z $pDir ]] 
  then
    cp -r build/* $path
  fi
}

pDir="$1"
run_build
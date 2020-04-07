#!/bin/bash
#script run after npm install

mkdir -p .git/hooks
cp git-hooks/* .git/hooks/
chmod u+x .git/hooks/* # Make the commit hooks executeable, or they don't run.

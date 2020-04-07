#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'
if [ "$CI" == "true" ]; then
  echo "On CI, continuing with deployment"
  ./node_modules/.bin/gh-pages -d public -b gh-pages -m "[skip ci] Updated"
else
  echo -e "${RED}---------------------------------"
  echo "------------  ERROR  ------------"
  echo "---------------------------------"
  echo ""
  echo "Can only run deploy script on CI"
  echo ""
  echo -e "---------------------------------${NC}"
  exit 1
fi

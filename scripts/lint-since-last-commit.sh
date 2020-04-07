#!/bin/bash
set -e

CHANGED_FILES=`git diff --name-only --cached --relative | grep '\.jsx\?$' | xargs`
CHANGED_FILES_ARRAY=(${CHANGED_FILES// / })
RESOLVED_CHANGED_FILES=""
for i in "${!CHANGED_FILES_ARRAY[@]}"
do
  if [ -f "${CHANGED_FILES_ARRAY[i]}" ]; then
    RESOLVED_CHANGED_FILES+=" ${CHANGED_FILES_ARRAY[i]}"
  fi
done

if [ "$RESOLVED_CHANGED_FILES" != "" ]; then
  npm run lint:changed -- $RESOLVED_CHANGED_FILES
  if [ $? -ne 0 ]; then exit 1; fi
fi

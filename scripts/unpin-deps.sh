#!/bin/sh
set -eu

find . \
  \( -name .git -o -name node_modules \) -prune -o \
  -name package.json -type f -exec perl -0pi -e 's/": "[\^*~]/": "/g' {} +

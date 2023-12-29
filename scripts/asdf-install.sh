#!/usr/bin/env bash
#
# This script installs the required asdf plugins by parsing .tool-versions before running `asdf install`.
# (It would have been nice if asdf had this built-in, but for some reason it doesn't).
#
set -e

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cat $SCRIPT_DIR/../.tool-versions | cut -d' ' -f1 | xargs -n 1 asdf plugin add || echo "asdf plugins installed"

asdf install
asdf reshim
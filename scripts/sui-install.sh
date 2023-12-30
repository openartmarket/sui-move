#!/usr/bin/env bash
#
# Installs the sui command line tool (if necessary)
#

if command -v sui &> /dev/null
then
    current_version=$(sui --version | cut -d' ' -f2 | cut -d '-' -f1)
    if [ "${current_version}" = "${SUI_VERSION}" ]; then
        echo "sui ${SUI_VERSION} is already installed"
        exit
    fi
fi

echo "Installing sui ${SUI_GIT_TAG}"
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag "${SUI_GIT_TAG}" sui
cargo install --git https://github.com/move-language/move move-analyzer --branch sui-move --features "address32"
asdf reshim

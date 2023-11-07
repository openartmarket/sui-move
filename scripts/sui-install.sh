#!/usr/bin/env bash
#
# Installs the sui command line tool (if necessary)
#

# Keep the version in sync with Move.toml
sui_version="1.8.2"

if command -v sui &> /dev/null
then
    current_version=$(sui --version | cut -d' ' -f2 | cut -d '-' -f1)
    if [ "$current_version" = "$sui_version" ]; then
        echo "sui ${sui_version} is already installed"
        exit
    fi
fi

echo "Installing sui ${sui_version}"
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag "mainnet-v${sui_version}" sui
cargo install --git https://github.com/move-language/move move-analyzer --branch sui-move --features "address32"
asdf reshim

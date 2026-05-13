#!/usr/bin/env bash
#
# Installs the sui command line tool from prebuilt release binaries (if necessary).
#
set -euo pipefail

# Keep the version in sync with Move.toml
sui_version="1.71.1"

if command -v sui &> /dev/null
then
    current_version=$(sui --version | cut -d' ' -f2 | cut -d '-' -f1)
    if [ "$current_version" = "$sui_version" ]; then
        echo "sui ${sui_version} is already installed"
        exit
    fi
fi

uname_s=$(uname -s)
uname_m=$(uname -m)
case "${uname_s}-${uname_m}" in
    Darwin-arm64)  asset="sui-mainnet-v${sui_version}-macos-arm64.tgz" ;;
    Darwin-x86_64) asset="sui-mainnet-v${sui_version}-macos-x86_64.tgz" ;;
    Linux-aarch64|Linux-arm64) asset="sui-mainnet-v${sui_version}-ubuntu-aarch64.tgz" ;;
    Linux-x86_64)  asset="sui-mainnet-v${sui_version}-ubuntu-x86_64.tgz" ;;
    *) echo "Unsupported platform: ${uname_s}-${uname_m}" >&2; exit 1 ;;
esac

# Install alongside cargo so asdf shims (or PATH) pick it up automatically.
if command -v asdf &> /dev/null && asdf which cargo &> /dev/null; then
    dest="$(dirname "$(asdf which cargo)")"
elif command -v cargo &> /dev/null; then
    dest="$(dirname "$(command -v cargo)")"
else
    dest="${CARGO_HOME:-$HOME/.cargo}/bin"
fi
mkdir -p "${dest}"

tmp=$(mktemp -d)
trap 'rm -rf "${tmp}"' EXIT

url="https://github.com/MystenLabs/sui/releases/download/mainnet-v${sui_version}/${asset}"
echo "Downloading ${url}"
curl -fL --retry 3 -o "${tmp}/${asset}" "${url}"

echo "Extracting to ${dest}"
tar -xzf "${tmp}/${asset}" -C "${tmp}"
for bin in sui sui-node sui-tool sui-faucet move-analyzer; do
    if [ -f "${tmp}/${bin}" ]; then
        install -m 0755 "${tmp}/${bin}" "${dest}/${bin}"
    fi
done

if command -v asdf &> /dev/null; then
    asdf reshim
fi

echo "Installed sui ${sui_version} to ${dest}"

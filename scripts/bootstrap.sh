echo "Installing Dependencies..."
asdf install
echo "Installing SUI..."
# Keep the version in sync with Move.toml and Dockerfile
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag testnet-v1.5.0 sui
cargo install --git https://github.com/move-language/move move-analyzer --branch sui-move --features "address32"
asdf reshim

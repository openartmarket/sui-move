echo "Installing SUI..."
# Keep the version in sync with Move.toml and Dockerfile
cargo install --locked --git https://github.com/MystenLabs/sui.git --tag mainnet-v1.8.2 sui
cargo install --git https://github.com/move-language/move move-analyzer --branch sui-move --features "address32"
asdf reshim

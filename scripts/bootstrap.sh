echo "Installing Dependencies..."
asdf install
echo "Installing SUI..."
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch devnet sui
cargo install --git https://github.com/move-language/move move-analyzer --branch sui-move --features "address32"



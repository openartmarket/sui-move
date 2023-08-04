#!/usr/bin/env bash
set -e

# Requires environment variables ADMIN_PHRASE and ADMIN_ADDRESS to be set

# Add a wallet to the system, so that we can publish the contracts
# This wallet needs to have SUI coins on it to pay for gas
sui keytool import "$ADMIN_PHRASE" ed25519
sui client switch --address "$ADMIN_ADDRESS"

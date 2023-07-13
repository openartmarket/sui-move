# Keep the version in sync with bootstrap.sh and Move.toml
FROM ghcr.io/shinamicorp/sui:testnet-v1.5.0
# FROM mysten/sui-tools:stable
USER root

RUN apt-get update && apt install -y jq

WORKDIR /usr/src/app
COPY . .
COPY --chown=root:root --chmod=+wx ./scripts/setup-oam-on-local-node.sh /usr/src/app/scripts/setup-oam-on-local-node.sh
EXPOSE 9000

CMD ["/bin/sh", "/usr/src/app/scripts/setup-oam-on-local-node.sh"]

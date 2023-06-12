FROM ghcr.io/shinamicorp/sui:testnet-v1.3.0
WORKDIR /usr/src/app
COPY . .
COPY --chown=root:root --chmod=+x ./entrypoint.sh /usr/src/app/entrypoint.sh
EXPOSE 9000
CMD ["/bin/sh", "/usr/src/app/entrypoint.sh"]

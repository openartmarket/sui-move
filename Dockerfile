FROM ghcr.io/shinamicorp/sui:testnet-v1.3.0
# FROM mysten/sui-tools:stable
USER root
RUN apt-get update && apt-get install -y jq && apt-get install -y curl
WORKDIR /usr/src/app
COPY . .
COPY --chown=root:root --chmod=+wx ./entrypoint.sh /usr/src/app/entrypoint.sh
EXPOSE 9000
CMD ["/bin/sh", "/usr/src/app/entrypoint.sh"]

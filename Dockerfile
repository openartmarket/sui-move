FROM ghcr.io/shinamicorp/sui:testnet-v1.3.0
# FROM mysten/sui-tools:stable
USER root
RUN apt-get update && apt-get install -y jq && apt-get install -y curl && apt-get install -y git && apt-get install -y build-essential
RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf
RUN echo ". $HOME/.asdf/asdf.sh" >> ~/.bashrc
RUN echo ". $HOME/.asdf/completions/asdf.bash" >> ~/.bashrc
RUN cat ./.tool-versions | cut -d' ' -f1 | xargs -n 1 asdf plugin add || echo "asdf plugins installed"
RUN asdf install
RUN asdf reshim
WORKDIR /usr/src/app
COPY . .
COPY --chown=root:root --chmod=+wx ./scripts/setup-oam-on-local-node.sh /usr/src/app/scripts/setup-oam-on-local-node.sh
EXPOSE 9000

CMD ["/bin/sh", "/usr/src/app/scripts/setup-oam-on-local-node.sh"]
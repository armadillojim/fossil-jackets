FROM node:8-alpine

ENV HOME=/fossil-jackets-client
RUN mkdir -p $HOME
WORKDIR $HOME

COPY ./package.json $HOME
RUN npm install --quiet

CMD $HOME/start.sh

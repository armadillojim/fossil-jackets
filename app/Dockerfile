# We can't use alpine because react-native requires bash for builds :(
FROM node:10-jessie

ENV HOME=/fossil-jackets-app
RUN mkdir -p $HOME
WORKDIR $HOME

RUN npm config set unsafe-perm true && npm install -g expo-cli

COPY ./babel.config.js $HOME
COPY ./package.json $HOME
COPY ./yarn.lock $HOME

RUN yarn

CMD $HOME/start.sh

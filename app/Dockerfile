# We can't use alpine because react-native requires bash for builds :(
FROM node:8-jessie

ENV HOME=/fossil-jackets-app
RUN mkdir -p $HOME
WORKDIR $HOME

COPY ./.babelrc $HOME
COPY ./package.json $HOME
COPY ./yarn.lock $HOME

RUN yarn

CMD $HOME/start.sh

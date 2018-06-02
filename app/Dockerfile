# We can't use alpine because react-native requires bash for builds :(
FROM node:8-jessie

ENV HOME=/fossil-jackets-app
RUN mkdir -p $HOME
WORKDIR $HOME

RUN npm install --quiet --global pm2

COPY ./package.json $HOME
RUN npm install --quiet

COPY . $HOME

CMD ["npm", "run", "start"]

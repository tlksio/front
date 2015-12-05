FROM node:latest
MAINTAINER Raül Pérez <repejota@gmail.com>

ENV USER root

RUN mkdir -p /install
ENV PATH /install/node_modules/.bin:$PATH
ENV NODE_PATH /install/node_modules/

COPY ./package.json /install/package.json
WORKDIR /install
RUN npm install

COPY . /opt/tlks.io/front
WORKDIR /opt/tlks.io/front

EXPOSE 9001

CMD ["node", "index.js"]

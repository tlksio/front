FROM node:latest
MAINTAINER Raül Pérez <repejota@gmail.com>

ENV USER root

RUN mkdir -p /install/
ENV PATH /install/node_modules/.bin:$PATH
ENV NODE_PATH /install/node_modules/

COPY ./package.json /install/package.json
RUN cd install; npm install

WORKDIR /opt/tlks.io/front
COPY . /opt/tlks.io/front

CMD ["bash"]

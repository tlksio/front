FROM node:latest
MAINTAINER Raül Pérez <repejota@gmail.com>
<<<<<<< HEAD

ENV USER root

RUN mkdir -p /install/
ENV PATH /install/node_modules/.bin:$PATH
ENV NODE_PATH /install/node_modules/

COPY ./package.json /install/package.json
RUN cd install; npm install

WORKDIR /opt/tlks.io/front
COPY . /opt/tlks.io/front

=======
RUN mkdir -p /opt/tlks.io/front
WORKDIR /opt/tlks.io/front
ADD package.json /opt/tlks.io/front
RUN npm install
>>>>>>> 502958c693129c62870d1d0824142c5097233369
CMD ["bash"]

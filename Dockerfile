FROM node:latest
MAINTAINER Raül Pérez <repejota@gmail.com>
RUN mkdir -p /opt/tlks.io/front
WORKDIR /opt/tlks.io/front
ADD package.json /opt/tlks.io/front
RUN npm install
CMD ["bash"]

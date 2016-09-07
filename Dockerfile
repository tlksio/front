FROM node
# Create app directory
RUN mkdir -p /opt/tlks.io/front
# Create cache directory
RUN mkdir -p /opt/tlks.io/.cache
# Create and setup  node_modules directory ( shared by all nodejs src )
RUN mkdir -p /opt/tlks.io/node_modules
ENV NODE_MODULES /opt/tlks.io/node_modules
# Install dependencies
COPY package.json /opt/tlks.io
WORKDIR /opt/tlks.io
RUN npm install
# Add sourcecode
ADD . /opt/tlks.io/front
WORKDIR /opt/tlks.io/front
EXPOSE 9001
CMD ["npm", "start"]


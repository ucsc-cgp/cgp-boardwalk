FROM node:6
# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
RUN npm install pm2 -g

# Install app dependencies
COPY . /usr/src/app/
RUN npm install
RUN npm -g install grunt-cli
RUN npm -g install typescript@2.7.2
RUN grunt build
RUN rm boardwalk.zip
RUN rm -rf spa/node_modules

EXPOSE 3000
#Set the node env
ENV NODE_ENV local
ENV BW_DATA_URL https://ucsc-cgp.org
CMD ["pm2-docker", "server/dist/server.js"]

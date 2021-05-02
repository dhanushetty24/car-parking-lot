# version of node to use
FROM node:latest
# define working directory for docker
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
# copy all our source code into the working directory
COPY . .
# exposing server 
EXPOSE 8080
CMD ["npm", "start"]
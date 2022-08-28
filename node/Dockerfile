FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# expose port 8080
EXPOSE 8080

# Here we will use node src/index.js to start your server:
# CMD [ "node", "src/index.js" ]
# CMD [ "nodemon", "src/index.js", "-e", "'js, hbs'" ]
CMD [ "npm", "run", "development" ]

# # Check out https://hub.docker.com/_/node to select a new base image
# FROM node:10-slim

# # Set to a non-root built-in user `node`
# USER node

# # Create app directory (with user `node`)
# #RUN mkdir -p /home/node/app

# WORKDIR /home/node/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# #COPY --chown=node package*.json ./

# #RUN npm install

# # Bundle app source code
# #COPY --chown=node . .

# #RUN npm run build

# # Bind to all network interfaces so that it can be mapped to the host OS
# ENV HOST=0.0.0.0 PORT=3000

# EXPOSE ${PORT}
# CMD [ "/home/node/app/start.sh"]

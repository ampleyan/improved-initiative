FROM node:19

# Install grunt and nodemon globally
RUN npm install -g grunt nodemon

# Set the working directory in the container
WORKDIR /usr/src/app
RUN mkdir -p ./public/webfonts/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Set environment variables
ENV NODE_ENV=development \
    BASE_URL=http://localhost:7070 \
    DEFAULT_ACCOUNT_LEVEL=epicinitiative \
    DB_CONNECTION_STRING=mongodb://ampleyan:Xus70aiaf71@localhost:27017/improvedInit

# Build the project with grunt
RUN grunt --no-color build_dev --force

# Expose the port the app runs on
EXPOSE 80

# Start the app using nodemon for automatic reloading
CMD ["nodemon", "server/server.js"]

FROM node:19

# Install grunt globally
RUN npm install -g grunt

# Set the working directory inside the container
WORKDIR /usr/src/app

# Create any directories you expect to exist before copying files.
# Ensure that the public and public/webfonts directories exist.
RUN mkdir -p ./public/webfonts

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application into the image.
COPY . .

# Set environment variables for development
ENV NODE_ENV='development'
ENV BASE_URL='http://localhost:7070'
ENV DEFAULT_ACCOUNT_LEVEL='epicinitiative'
ENV DB_CONNECTION_STRING='mongodb://mongoadmin:secret@localhost:27017''

# Run your build process here
RUN grunt --no-color build_dev

# Expose port 80 for the application
EXPOSE 80

# The command to start your app
CMD [ "node", "server/server.js" ]

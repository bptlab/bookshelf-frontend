FROM node:10
WORKDIR /usr/src/bookshelf-frontend
COPY . .
RUN npm install
CMD npm run envsubst && \
    npm start

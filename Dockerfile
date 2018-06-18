FROM node
WORKDIR /usr/src/bookshelf-frontend
RUN npm install
CMD npm run envsubst && \
    npm start

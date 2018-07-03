FROM node:10
WORKDIR /usr/src/bookshelf-frontend
COPY . .
RUN npm install
CMD ls && \ 
    pwd && \ 
    npm run envsubst && \
    npm start

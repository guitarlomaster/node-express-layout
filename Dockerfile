FROM node:12

WORKDIR /var/www/fellowhelp-server

COPY ./ ./

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "dev:ci"]

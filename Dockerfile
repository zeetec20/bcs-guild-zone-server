FROM node:16-alpine

WORKDIR /usr/app/scr
COPY . .

RUN npm install

EXPOSE 4000
CMD ["npm", "run", "start"]
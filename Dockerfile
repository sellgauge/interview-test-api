FROM node:16
COPY ./ /home/node/app/
WORKDIR /home/node/app/
RUN npm install
USER node
CMD ["npm", "start"]
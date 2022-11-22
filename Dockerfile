FROM node:16
COPY ./ /home/node/app/
WORKDIR /home/node/app/
RUN chown node /home/node/app -R
USER node
RUN npm install
CMD ["npm", "start"]
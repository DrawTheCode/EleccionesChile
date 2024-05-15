FROM node:18-alpine3.18
RUN mkdir -p /home/app
COPY . /home/app
EXPOSE 3050
CMD ["node","/home/app/build/index.js"]
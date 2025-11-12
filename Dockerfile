FROM node:18-alpine

# this is the woking directory which holds the  entire file and we get it by the first dot
WORKDIR  /dejene
COPY package.json /dejene
RUN npm install

#copiyng the current directory (local files)to the container
COPY . .
EXPOSE 3000

CMD ["npm","start"]

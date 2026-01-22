FROM node:18-alpine

# this is the woking directory which holds the  entire file and we get it by the first dot
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci || npm i
COPY . .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["npm","start"]

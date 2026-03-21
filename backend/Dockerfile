FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Generate Prisma Client during build step if necessary
# RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

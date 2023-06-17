FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install --force
COPY . .
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

EXPOSE 4001

CMD ["npm", "run", "start:dev"]


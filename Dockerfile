FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build && rm -f .env

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app ./
RUN rm -f .env .env.local .env.production .env.production.local
EXPOSE 3000
CMD ["npm", "run", "start"]

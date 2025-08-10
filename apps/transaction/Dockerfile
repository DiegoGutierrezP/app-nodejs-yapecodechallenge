# --- Build phase ---
FROM node:18.20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build transaction

# --- Production phase ---
FROM node:18.20-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
USER node
CMD ["node", "dist/apps/transaction/main"]

FROM node:18 AS base
RUN npm install -g @angular/cli

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json /app/

RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN ng version
RUN npm run build --verbose

FROM base as runner
WORKDIR /app
# Copy dependency definitions
COPY --from=builder /app/dist/result-ui /app

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["node", "server/server.mjs"]
# FROM node:18 as build

# WORKDIR /app

# COPY package.json package-lock.json /app/


# RUN npm install

# COPY . .

# RUN npm run build

# # Stage 2: Set up the server

# FROM node:18 as serve

# WORKDIR /app

# COPY --from=build /app/dist ./dist

# RUN npm install -g http-server

# EXPOSE 8080

# CMD [ "http-server", "-p", "8080", "dist/angular-ssr/browser" ]
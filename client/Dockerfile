# syntax=docker/dockerfile:1
# Expense Splitter (Enhanced) — client, LOCAL DEVELOPMENT image.
# Built with context = repo root (see docker-compose.yml) -- same npm
# workspaces reasoning as server/Dockerfile.

FROM node:22-alpine AS development

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

RUN npm ci

WORKDIR /app/client

EXPOSE 5173

# --host 0.0.0.0 is required so Vite's dev server is reachable from outside the
# container (from the host machine's browser), not just from localhost inside it.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

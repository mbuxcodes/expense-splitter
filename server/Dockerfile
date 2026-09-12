# syntax=docker/dockerfile:1
# Expense Splitter (Enhanced) — server, LOCAL DEVELOPMENT image.
# Built with context = repo root (see docker-compose.yml) so npm workspaces
# resolve correctly -- a workspace install needs every workspace's package.json
# present, not just server/'s.

FROM node:22-alpine AS development

WORKDIR /app

# Copy only manifest files first. Docker layer caching means `npm ci` only
# re-runs when a package.json/package-lock.json actually changes -- not on
# every source-code edit, which is what keeps rebuilds fast during development.
COPY package.json package-lock.json ./
COPY client/package.json ./client/package.json
COPY server/package.json ./server/package.json

# Installing once at the root (all workspaces) is a deliberate dev-environment
# trade-off: simpler than a workspace-scoped install, at the cost of the server
# image also containing client dependencies it doesn't use. Acceptable for a
# local dev container; a production build image (a later milestone) would use
# a multi-stage, workspace-scoped install to keep the final image lean.
RUN npm ci

WORKDIR /app/server

EXPOSE 5000

# tsx watch provides hot reload on source changes (bind-mounted via docker-compose.yml).
CMD ["npm", "run", "dev"]

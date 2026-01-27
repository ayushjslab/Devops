# -------------------------
# 1️⃣ Base image
# -------------------------
FROM node:20-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# -------------------------
# 2️⃣ Dependencies layer
# -------------------------
FROM base AS deps

# Install libc6-compat (required by some npm packages)
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# -------------------------
# 3️⃣ Build layer
# -------------------------
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# -------------------------
# 4️⃣ Production runner
# -------------------------
FROM base AS runner

# Security: non-root user
RUN addgroup -g 1001 -S nodejs \
  && adduser -S nextjs -u 1001

WORKDIR /app

# Copy only required files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
FROM node:24-trixie-slim
LABEL project=dreamcon-demo

RUN apt-get update \
  && apt-get install -y --no-install-recommends default-jre-headless \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@11

WORKDIR /app
ENV HUSKY=0 VITE_USE_FIREBASE_EMULATOR=true

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm firebase setup:emulators:firestore

COPY . .
ARG VITE_BASE_URL=http://localhost:5173
ENV VITE_BASE_URL=$VITE_BASE_URL
RUN pnpm build

EXPOSE 5173
CMD ["pnpm", "firebase", "emulators:exec", "--project", "demo-dreamcon", "pnpm seed:emulator && pnpm vite preview --port 5173"]

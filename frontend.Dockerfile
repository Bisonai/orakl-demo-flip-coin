FROM node:18-alpine AS build

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
WORKDIR /app

COPY --chown=nextjs:nodejs frontend frontend

WORKDIR /app/frontend

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs



RUN yarn install && yarn build
RUN chown nextjs:nodejs .next

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

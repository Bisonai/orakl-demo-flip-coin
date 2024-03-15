# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /app
COPY jobs jobs

WORKDIR /app/jobs
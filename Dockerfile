FROM node:16-alpine
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY . .
# COPY .env.production .env
RUN yarn install --frozen-lockfile && yarn build && yarn cache clean
ENV NODE_ENV production
EXPOSE 4000
CMD [ "node", "dist/index.js" ]
USER node
FROM node:10 AS frontend-builder

WORKDIR /app
COPY . ./
RUN yarn install
RUN cd packages/editor && yarn run build

ARG Frontend
FROM nginx:1.19
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=frontend-builder /app/packages/editor/build .
EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
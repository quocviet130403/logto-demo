# Build Casvisor from source with custom Casdoor JWT certificate
# The certificate must be embedded at compile time (Go //go:embed directive)

FROM node:18.19.0 AS frontend
RUN git clone --depth 1 https://github.com/casvisor/casvisor.git /casvisor
WORKDIR /casvisor/web
RUN yarn install --frozen-lockfile --network-timeout 1000000 && yarn run build

FROM golang:1.22 AS backend
WORKDIR /go/src/casvisor
COPY --from=frontend /casvisor /go/src/casvisor
# Inject custom Casdoor JWT certificate (replaces the demo cert)
COPY token_jwt_key.pem /go/src/casvisor/controllers/token_jwt_key.pem
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o server .

FROM alpine:latest
LABEL maintainer="https://casvisor.org/"
RUN apk add --no-cache ca-certificates curl sudo
RUN mkdir -p /home/casvisor
WORKDIR /home/casvisor
COPY --from=backend /go/src/casvisor/server /home/casvisor/server
COPY --from=backend /go/src/casvisor/web/build /home/casvisor/web/build
COPY --from=backend /go/src/casvisor/data /data
EXPOSE 19000
CMD ["./server", "--createDatabase=true"]

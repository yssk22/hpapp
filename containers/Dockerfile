FROM gcr.io/cloudsql-docker/gce-proxy:1.09 AS gce-proxy
FROM golang:1.22.4 AS go
FROM oven/bun:1.1.16 AS bun
FROM google/cloud-sdk:latest AS cloud-sdk

# slim container as a base line
FROM debian:stable-slim

RUN apt-get update && apt-get install -y git build-essential make wget curl sudo bash procps default-mysql-client vim sqlite3

## remove fastai as it is currently not developed
## COPY --from=fastai /opt/conda /opt/conda
COPY --from=gce-proxy /cloud_sql_proxy /usr/local/bin/cloud_sql_proxy
COPY --from=go /usr/local/go /usr/local/go
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY --from=bun /usr/local/bin/bunx /usr/local/bin/bunx

ENV ANDROID_HOME /opt/android-sdk
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

## for go development
ENV GOROOT /usr/local/go
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.52.2

## for expo development
RUN bun add -g prettier expo-cli eas-cli

ENV PATH $PATH:/usr/local/bin:/usr/local/go/bin:$GOPATH/bin:/root/.bun/bin/

### python

USER root
CMD ["/bin/bash"]

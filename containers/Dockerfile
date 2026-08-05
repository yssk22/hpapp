FROM gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.14.0 AS cloud-sql-proxy
FROM golang:1.22.4 AS go
FROM node:22.13.1 AS node
FROM google/cloud-sdk:latest AS cloud-sdk

ENV ANDROID_HOME=/opt/android-sdk
ENV NVIDIA_VISIBLE_DEVICES=all
ENV NVIDIA_DRIVER_CAPABILITIES=compute,utility

COPY --from=cloud-sql-proxy /cloud-sql-proxy /usr/local/bin/cloud-sql-proxy
COPY --from=go /usr/local/go /usr/local/go
COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=node /opt/ /opt/

RUN apt-get update && apt-get install -y make wget curl sudo android-sdk
ENV GOROOT=/usr/local/go
ENV GOPATH=/go
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.52.2

ENV PATH=${PATH}:/usr/local/bin:/usr/local/go/bin:${GOPATH}/bin:/usr/local/lib/node_modules/.bin

## tools for dev
RUN apt-get install -y bash procps default-mysql-client vim sqlite3

## yarn
RUN corepack enable \
	&& corepack prepare yarn@1.22.22 --activate \
	&& yarn global add prettier expo-cli eas-cli expo-doctor

### python
### See onCreateCommand.sh

USER root
CMD ["/bin/bash"]

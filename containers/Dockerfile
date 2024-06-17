FROM gcr.io/cloudsql-docker/gce-proxy:1.09 AS gce-proxy
FROM golang:1.22.4 AS go
FROM node:18.16.0 AS node
FROM google/cloud-sdk:latest AS cloud-sdk

ENV ANDROID_HOME /opt/android-sdk
ENV NVIDIA_VISIBLE_DEVICES all
ENV NVIDIA_DRIVER_CAPABILITIES compute,utility

## remove fastai as it is currently not developed
## COPY --from=fastai /opt/conda /opt/conda
COPY --from=gce-proxy /cloud_sql_proxy /usr/local/bin/cloud_sql_proxy
COPY --from=go /usr/local/go /usr/local/go
COPY --from=node /usr/local/bin/ /usr/local/bin/
COPY --from=node /usr/local/lib/node_modules/ /usr/local/lib/node_modules/
COPY --from=node /opt/ /opt/

RUN apt-get update && apt-get install -y make wget curl sudo
ENV GOROOT /usr/local/go
RUN curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.52.2

ENV PATH $PATH:/usr/local/bin:/usr/local/go/bin:$GOPATH/bin:/usr/local/node_modules/.bin/

## tools for dev
RUN apt-get install -y bash procps default-mysql-client vim sqlite3

## yarn
RUN /usr/local/bin/yarn global add prettier expo-cli eas-cli

### python
### See onCreateCommand.sh 


### For application setup
env FACE_DETECTION_SCRIPT_PATH /workspaces/sites/py/yssk22.dev/run/detect_faces.py

USER root
CMD ["/bin/bash"]

FROM golang:1.18.3 AS builder

# Create go mod cache layer. 
WORKDIR /app
COPY ./go/go.mod ./go/go.mod
COPY ./go/go.sum ./go/go.sum

WORKDIR /app/go
RUN go mod download

# Copy all source code and build the binary.
WORKDIR /app
COPY ./go/ ./go/

WORKDIR /app/go
RUN go build -v -o hpapp ./cmd/

# Use the official Debian slim image for a lean production container.
# https://hub.docker.com/_/debian
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM debian:stable-slim
ARG gcp_project_id
ARG datastore_settings_kind

RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y \
    ca-certificates 

ENV PATH=/usr/local/bin:$PATH

# # Copy the binary to the production image from the builder stage.
COPY --from=builder /app/go/hpapp /app/hpapp

ENV HPAPP_GCP_PROJECT_ID=$gcp_project_id
ENV HPAPP_GCP_DATASTORE_SETTINGS_KIND=$datastore_settings_kind

CMD ["/app/hpapp", "--prod", "httpserver"]
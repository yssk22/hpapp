GO = go

.PHONY: test generate

lint:
	golangci-lint cache clean
	golangci-lint run --config=.golangci.yaml --print-issued-lines=false --out-format=colored-line-number --issues-exit-code=0 ./...

generate:
	$(GO) generate ./service/schema/enums/
	$(GO) generate ./service/
	$(GO) generate ./graphql/...

clear-snapshots:
	find ./ -name 'snapshot.*.json' -delete
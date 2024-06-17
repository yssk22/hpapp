GO = go

.PHONY: test generate

lint:
	golangci-lint cache clean
	golangci-lint run --config=.golangci.yaml --print-issued-lines=false --out-format=colored-line-number --issues-exit-code=0 ./...

generate:
	$(GO) generate ./service/schema/enums/
	$(GO) generate ./service/
	$(GO) generate ./graphql/...

pages:
	$(GO) install golang.org/x/tools/cmd/godoc@latest
	rm -rf localhost:8888 ../docs/go/gopkg
	$(shell go env GOPATH)/bin/godoc -http=localhost:8888 &
	sleep 30
	wget -r -np -nv -N -E -p -k -e robots=off --reject-regex="png" "http://127.0.0.1:8888/pkg/github.com/yssk22/hpapp/go/"
	pkill godoc
	mv 127.0.0.1:8888/ ../docs/go/gopkg
	
clear-snapshots:
	find ./ -name 'snapshot.*.json' -delete
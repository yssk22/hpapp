package generator

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"reflect"
	"syscall"
	"testing"
	"time"

	"github.com/yssk22/hpapp/go/devtool/generator"
	"github.com/yssk22/hpapp/go/devtool/generator/entgo"
	"github.com/yssk22/hpapp/go/devtool/generator/graphql/gqlgen"
	"github.com/yssk22/hpapp/go/devtool/generator/graphql/schema"
	"github.com/yssk22/hpapp/go/foundation/assert"
	"github.com/yssk22/hpapp/go/foundation/netutil"
)

func TestE2E(t *testing.T) {
	a := assert.NewTestAssert(t)
	var assertFileIsCreated = func(path string) {
		stat, err := os.Stat(path)
		a.Nil(err)
		a.OK(stat.Mode().IsRegular())
	}

	// cleanup gqlgen dir
	os.RemoveAll("./testdata/e2e/gqlgen")
	// generate enums
	a.Nil(generator.Generate(
		entgo.NewEnumGenerator("./testdata/e2e/models"),  // entgo_enums.go is generated
		gqlgen.NewEnumGenerator("./testdata/e2e/models"), // gqlgen_enums.go is generated
		schema.NewGenerator(
			schema.WithOutputFile("./testdata/e2e/gqlgen/schema.graphql"),
			schema.WithRoot(
				"github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/models.Query",
				"github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/models.Mutation",
			),
		),
		gqlgen.NewResolverGenerator("./testdata/e2e/gqlgen/resolver.go", "github.com/yssk22/hpapp/go/devtool/generator/test/testdata/e2e/models"),
		gqlgen.NewGQLGenGenerator("./testdata/e2e/models/gqlgen.yml"),
	))
	assertFileIsCreated("./testdata/e2e/models/entgo_enum.go")
	assertFileIsCreated("./testdata/e2e/models/gqlgen_enum.go")
	assertFileIsCreated("./testdata/e2e/gqlgen/schema.graphql")
	assertFileIsCreated("./testdata/e2e/gqlgen/resolver.go")
	assertFileIsCreated("./testdata/e2e/gqlgen/exec_generated.go")
	// launch a new server process
	var cmdErr error
	var stderr bytes.Buffer
	port, err := netutil.GetEphermeralPort()
	a.Nil(err)
	endpoint := fmt.Sprintf("http://localhost:%d/query", port)
	cmd := exec.Command("go", "run", "./", fmt.Sprintf("%d", port)) //nolint:gosec // it's a test environment
	cmd.Stderr = &stderr
	cmd.Dir = "./testdata/e2e/"
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
	go func() {
		cmdErr = cmd.Run()
	}()
	defer func() {
		if cmdErr != nil {
			t.Fatalf("cannot start a process: %s - stderr: %s", cmdErr, stderr.String())
		}
		if cmd.Process != nil {
			if err := syscall.Kill(-cmd.Process.Pid, syscall.SIGKILL); err != nil {
				panic(err)
			}
		}
	}()
	time.Sleep(5 * time.Second)

	// now request a query and make sure the server can respond to it.
	query := `{
queryExample {
	fieldString
	fieldStruct {
		fieldString	
	}
	filedStructWithMarshaler
	fieldUserDefinedScalar
	fieldUserDefinedEnum
  }
}`
	expect := map[string]interface{}{
		"queryExample": map[string]interface{}{
			"fieldString": "strValue",
			"fieldStruct": map[string]interface{}{
				"fieldString": "strValue",
			},
			"filedStructWithMarshaler": float64(10),
			"fieldUserDefinedScalar":   "no",
			"fieldUserDefinedEnum":     "value_a",
		},
	}
	requestBody, _ := json.Marshal(map[string]interface{}{
		"query": query,
	})
	var resp *http.Response
	var retry = 0
	for retry < 10 {
		resp, err = http.Post(endpoint, "application/json", bytes.NewReader(requestBody)) //nolint:gosec // it's a test environment
		if err != nil {
			time.Sleep(500 * time.Millisecond)
			retry++
		} else {
			break
		}
	}
	if err != nil {
		t.Fatalf("cannot connect server: %v", err)
	}
	defer resp.Body.Close()
	var v = make(map[string]interface{})
	if err := json.NewDecoder(resp.Body).Decode(&v); err != nil {
		panic(err)
	}
	got := v["data"].(map[string]interface{})
	if !reflect.DeepEqual(expect, got) {
		t.Fatalf("expected: %v, got: %v", expect, got)
	}
}

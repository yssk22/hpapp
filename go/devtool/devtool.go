package devtool

import (
	"fmt"
	"strings"

	"golang.org/x/tools/go/packages"
)

func GetAllPackages(moduleName string) ([]*packages.Package, error) {
	cfg := &packages.Config{
		Mode: packages.NeedName | packages.NeedTypes | packages.NeedSyntax,
	}
	return packages.Load(cfg, moduleName)
}

func ParseFullQualifiedName(name string) (string, string) {
	tmp := strings.Split(name, "/")
	if len(tmp) == 1 {
		// no path
		tmp1 := strings.Split(tmp[0], ".")
		if len(tmp1) == 1 { // no extention
			return "", name
		}
		structName := tmp1[len(tmp1)-1]
		return strings.TrimSuffix(name, fmt.Sprintf(".%s", structName)), structName
	}
	lastPart := tmp[len(tmp)-1]
	tmp1 := strings.Split(lastPart, ".")
	if len(tmp1) == 1 {
		// no extension, then everything is pkg
		return strings.Join(tmp, "/"), ""
	}
	structName := tmp1[len(tmp1)-1]
	return strings.TrimSuffix(name, fmt.Sprintf(".%s", structName)), structName
}

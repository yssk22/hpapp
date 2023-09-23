package settings

import (
	"go/ast"
	"go/token"
	"regexp"
	"sort"
	"strings"

	"github.com/yssk22/hpapp/go/devtool"
	"golang.org/x/tools/go/packages"
)

type ItemInfo struct {
	KeyName     string
	PackageName string
	VarName     string
	TypeName    string
}

func CaptureSettings(packageName string) ([]*ItemInfo, error) {
	pkgs, err := devtool.GetAllPackages(packageName)
	if err != nil {
		return nil, err
	}
	var defs []*ItemInfo
	for _, pkg := range pkgs {
		if pkg.ID == "github.com/yssk22/hpapp/go/system/settings" {
			continue
		}
		vars := getItemVars(pkg)
		if len(vars) == 0 {
			continue
		}
		fillKeyLiteral(pkg, vars)
		defs = append(defs, vars...)
	}
	sort.Slice(defs, func(i, j int) bool {
		return defs[i].KeyName < defs[j].KeyName
	})
	return defs, nil
}

var typeName = regexp.MustCompile(`hpapp\.yssk22\.dev/go/system/settings\.Item\[(.+)\]`)

func getItemVars(pkg *packages.Package) []*ItemInfo {
	var defs []*ItemInfo
	for _, name := range pkg.Types.Scope().Names() {
		obj := pkg.Types.Scope().Lookup(name)
		matches := typeName.FindStringSubmatch(obj.Type().String())
		if len(matches) > 0 {
			defs = append(defs, &ItemInfo{
				PackageName: pkg.ID,
				VarName:     name,
				TypeName:    matches[1],
			})
		}
	}
	return defs
}

func fillKeyLiteral(pkg *packages.Package, defs []*ItemInfo) {
	for _, f := range pkg.Syntax {
		for _, decl := range f.Decls {
			genDecl, ok := decl.(*ast.GenDecl)
			if !ok || genDecl.Tok != token.VAR {
				continue
			}
			for _, spec := range genDecl.Specs {
				valueSpec, ok := spec.(*ast.ValueSpec)
				if !ok {
					continue
				}
				for _, name := range valueSpec.Names {
					for _, def := range defs {
						if def.VarName == name.Name {
							def.KeyName = getFirstStringLiteral(valueSpec)
						}
					}
				}
			}
		}
	}
}

func getFirstStringLiteral(varSpec *ast.ValueSpec) string {
	callExpr, ok := varSpec.Values[0].(*ast.CallExpr)
	if !ok {
		return "__invalid__"
	}
	arg := callExpr.Args[0]
	basicLit, ok := arg.(*ast.BasicLit)
	if !ok || basicLit.Kind != token.STRING {
		return "__invalid__"
	}
	return strings.Trim(basicLit.Value, "\"")
}

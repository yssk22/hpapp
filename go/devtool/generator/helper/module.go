package helper

import (
	"errors"
	"fmt"
	"go/build"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"
)

// ResolveGoImportPath resolves directry path to go import statement path.
func ResolveGoImportPath(dir string) (string, error) {
	absPath, err := filepath.Abs(dir)
	if err != nil {
		return "", err
	}
	absModuleRootPath, moduleName, err := findGoModInfo(absPath)
	if err != nil {
		if err != ErrGoModNotFound {
			return "", err
		}
		// go.mod not found
		absGoPath, err := filepath.Abs(build.Default.GOPATH)
		if err != nil {
			return "", err
		}
		absGoPath = filepath.Join(absGoPath, "src")
		if !strings.HasPrefix(absPath, absGoPath) {
			return "", fmt.Errorf("not in $GOPATH/src (%s)", absGoPath)
		}
		offset := len(absGoPath) + 1
		return absPath[offset:], nil
	}
	// absPath is ${absModuleRootPath}/my/package/path/dir
	// and the import path should be ${moduleName}/my/package/path/dir
	return path.Join(moduleName, strings.TrimPrefix(absPath, absModuleRootPath)), nil
}

var (
	moduleDefRe      = regexp.MustCompile("module\\s+(\\S+)\n")
	ErrGoModNotFound = errors.New("go.mod file is not found in the directory and it's parents")
)

// findGoModInfo finds go.mod file under the directory (or parent directories)
// and resturns the directory path where go.mod exists and module string declared in go.mod file.
func findGoModInfo(dir string) (string, string, error) {
	gomod := filepath.Join(dir, "go.mod")
	_, err := os.Stat(gomod)
	if err != nil {
		if os.IsNotExist(err) {
			if dir == "/" {
				return "", "", ErrGoModNotFound
			}
			return findGoModInfo(filepath.Join(dir, "..") + "/")
		}
		return "", "", err
	}
	contents, err := ioutil.ReadFile(gomod)
	if err != nil {
		return "", "", err
	}
	found := moduleDefRe.FindSubmatch(contents)
	if len(found) == 0 {
		return "", "", fmt.Errorf("could not find module declaration in %s", gomod)
	}
	return dir, string(found[1]), nil
}

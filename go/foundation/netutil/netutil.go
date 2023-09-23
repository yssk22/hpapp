package netutil

import "net"

// GetEphermeralPort returns a free port on the local machine.
func GetEphermeralPort() (int, error) {
	ln, err := net.Listen("tcp", "localhost:0")
	if err != nil {
		return 0, err
	}
	defer ln.Close()
	return ln.Addr().(*net.TCPAddr).Port, nil
}

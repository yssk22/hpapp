package slice

// Chunk splits a given []T into the multiple chunks ([][]T) where each of chunk size is n.
func Chunk[T any](list []T, n int) [][]T {
	var l = len(list)
	var numChunks = l / n
	if l%n != 0 {
		numChunks += 1
	} else if l == 0 {
		numChunks = 1
	}
	var i = 0
	var chunkIdx = 0
	var chunks = make([][]T, numChunks)
	for i < l {
		chunkSize := n
		if i+chunkSize >= l {
			chunkSize = l - i
		}
		chunk := make([]T, chunkSize)
		for j := 0; j < chunkSize; j++ {
			chunk[j] = list[i]
			i += 1
		}
		chunks[chunkIdx] = chunk
		chunkIdx += 1
	}
	return chunks
}

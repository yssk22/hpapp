package blob

import (
	"context"
	"fmt"
	"image"
	"io"

	_ "image/jpeg"
	_ "image/png"

	_ "golang.org/x/image/webp"

	"hpapp.yssk22.dev/go/service/ent"
	"hpapp.yssk22.dev/go/service/schema/enums"
	"hpapp.yssk22.dev/go/system/slog"
)

type ImageProcessor func(context.Context, *ent.HPBlobUpdateOne, *ent.HPBlob, io.Reader, slog.Attributes) error

func (p ImageProcessor) GetType() enums.HPBlobType {
	return enums.HPBlobTypeImage
}

func (p ImageProcessor) Process(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, reader io.Reader, log slog.Attributes) error {
	return p(ctx, update, b, reader, log)
}

// imageProcessor Dimention is a processor to measure image height and width.
var imageProcessorDimention = ImageProcessor(func(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, reader io.Reader, log slog.Attributes) error {
	img, _, err := image.DecodeConfig(reader)
	if err != nil {
		return fmt.Errorf("cannot decode image binary: %v", err)
	}
	update.SetWidth(img.Width)
	update.SetHeight(img.Height)
	return nil
})

//
// hpapp doesn't open sourced the face recognition processor as it now requires a complex system setup more than just a go implementation.
//
// var faceRecognition = ImageProcessor(func(ctx context.Context, update *ent.HPBlobUpdateOne, b *ent.HPBlob, binary []byte, log slog.Attributes) error {
// 	...
// })

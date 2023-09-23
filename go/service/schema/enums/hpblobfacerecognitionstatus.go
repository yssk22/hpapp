package enums

type HPBlobFaceRecognitionStatus string

const (
	HPBlobFaceRecognitionStatusUnknown                  HPBlobFaceRecognitionStatus = "unknown"
	HPBlobFaceRecognitionStatusFaceDetected             HPBlobFaceRecognitionStatus = "face_detected"
	HPBlobFaceRecognitionStatusFaceManuallyLabeled      HPBlobFaceRecognitionStatus = "face_manually_labeled"
	HPBlobFaceRecognitionStatusFaceAutomaticallyLabeled HPBlobFaceRecognitionStatus = "face_automatically_labeled"
	HPBlobFaceRecognitionStatusError                    HPBlobFaceRecognitionStatus = "error"
)

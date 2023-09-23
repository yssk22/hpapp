package enums

type HPMediaFaceRecognitionStatus string

const (
	HPMediaFaceRecognitionStatusUnknown                  HPMediaFaceRecognitionStatus = "unknown"
	HPMediaFaceRecognitionStatusFaceDetected             HPMediaFaceRecognitionStatus = "face_detected"
	HPMediaFaceRecognitionStatusFaceManuallyLabeled      HPMediaFaceRecognitionStatus = "face_manually_labeled"
	HPMediaFaceRecognitionStatusFaceAutomaticallyLabeled HPMediaFaceRecognitionStatus = "face_automatically_labeled"
	HPMediaFaceRecognitionStatusError                    HPMediaFaceRecognitionStatus = "error"
)

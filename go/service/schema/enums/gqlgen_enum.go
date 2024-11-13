package enums

import (
	"fmt"
	"io"
	"strconv"
)

func (e HPAssetType) MarshalGQL(w io.Writer) {
	switch e {
	case HPAssetTypeAmeblo:
		fmt.Fprint(w, strconv.Quote("ameblo"))
	case HPAssetTypeElineupMall:
		fmt.Fprint(w, strconv.Quote("elineup_mall"))
	case HPAssetTypeInstagram:
		fmt.Fprint(w, strconv.Quote("instagram"))
	case HPAssetTypeTiktok:
		fmt.Fprint(w, strconv.Quote("tiktok"))
	case HPAssetTypeTwitter:
		fmt.Fprint(w, strconv.Quote("twitter"))
	case HPAssetTypeYoutube:
		fmt.Fprint(w, strconv.Quote("youtube"))
	}
}

func (e *HPAssetType) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "ameblo":
		*e = HPAssetTypeAmeblo
	case "elineup_mall":
		*e = HPAssetTypeElineupMall
	case "instagram":
		*e = HPAssetTypeInstagram
	case "tiktok":
		*e = HPAssetTypeTiktok
	case "twitter":
		*e = HPAssetTypeTwitter
	case "youtube":
		*e = HPAssetTypeYoutube
	}
	return nil
}

func (e HPBlobFaceRecognitionStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPBlobFaceRecognitionStatusError:
		fmt.Fprint(w, strconv.Quote("error"))
	case HPBlobFaceRecognitionStatusFaceAutomaticallyLabeled:
		fmt.Fprint(w, strconv.Quote("face_automatically_labeled"))
	case HPBlobFaceRecognitionStatusFaceDetected:
		fmt.Fprint(w, strconv.Quote("face_detected"))
	case HPBlobFaceRecognitionStatusFaceManuallyLabeled:
		fmt.Fprint(w, strconv.Quote("face_manually_labeled"))
	case HPBlobFaceRecognitionStatusUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPBlobFaceRecognitionStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "error":
		*e = HPBlobFaceRecognitionStatusError
	case "face_automatically_labeled":
		*e = HPBlobFaceRecognitionStatusFaceAutomaticallyLabeled
	case "face_detected":
		*e = HPBlobFaceRecognitionStatusFaceDetected
	case "face_manually_labeled":
		*e = HPBlobFaceRecognitionStatusFaceManuallyLabeled
	case "unknown":
		*e = HPBlobFaceRecognitionStatusUnknown
	}
	return nil
}

func (e HPBlobStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPBlobStatusError:
		fmt.Fprint(w, strconv.Quote("error"))
	case HPBlobStatusNeedDownload:
		fmt.Fprint(w, strconv.Quote("need_download"))
	case HPBlobStatusReadyToHost:
		fmt.Fprint(w, strconv.Quote("ready_to_host"))
	case HPBlobStatusUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPBlobStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "error":
		*e = HPBlobStatusError
	case "need_download":
		*e = HPBlobStatusNeedDownload
	case "ready_to_host":
		*e = HPBlobStatusReadyToHost
	case "unknown":
		*e = HPBlobStatusUnknown
	}
	return nil
}

func (e HPBlobSubType) MarshalGQL(w io.Writer) {
	switch e {
	case HPBlobSubTypeHtml:
		fmt.Fprint(w, strconv.Quote("html"))
	case HPBlobSubTypeJpeg:
		fmt.Fprint(w, strconv.Quote("jpeg"))
	case HPBlobSubTypeMp4:
		fmt.Fprint(w, strconv.Quote("mp4"))
	case HPBlobSubTypeUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPBlobSubType) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "html":
		*e = HPBlobSubTypeHtml
	case "jpeg":
		*e = HPBlobSubTypeJpeg
	case "mp4":
		*e = HPBlobSubTypeMp4
	case "unknown":
		*e = HPBlobSubTypeUnknown
	}
	return nil
}

func (e HPBlobType) MarshalGQL(w io.Writer) {
	switch e {
	case HPBlobTypeImage:
		fmt.Fprint(w, strconv.Quote("image"))
	case HPBlobTypeText:
		fmt.Fprint(w, strconv.Quote("text"))
	case HPBlobTypeUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	case HPBlobTypeVideo:
		fmt.Fprint(w, strconv.Quote("video"))
	}
}

func (e *HPBlobType) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "image":
		*e = HPBlobTypeImage
	case "text":
		*e = HPBlobTypeText
	case "unknown":
		*e = HPBlobTypeUnknown
	case "video":
		*e = HPBlobTypeVideo
	}
	return nil
}

func (e HPElineupMallItemCategory) MarshalGQL(w io.Writer) {
	switch e {
	case HPElineupMallItemCategoryBlueray:
		fmt.Fprint(w, strconv.Quote("blueray"))
	case HPElineupMallItemCategoryClearFile:
		fmt.Fprint(w, strconv.Quote("clear_file"))
	case HPElineupMallItemCategoryColllectionOther:
		fmt.Fprint(w, strconv.Quote("colllection_other"))
	case HPElineupMallItemCategoryColllectionPhoto:
		fmt.Fprint(w, strconv.Quote("colllection_photo"))
	case HPElineupMallItemCategoryColllectionPinnapPoster:
		fmt.Fprint(w, strconv.Quote("colllection_pinnap_poster"))
	case HPElineupMallItemCategoryDVD:
		fmt.Fprint(w, strconv.Quote("dvd"))
	case HPElineupMallItemCategoryDVDMagazine:
		fmt.Fprint(w, strconv.Quote("dvd_magazine"))
	case HPElineupMallItemCategoryDVDMagazineOther:
		fmt.Fprint(w, strconv.Quote("dvd_magazine_other"))
	case HPElineupMallItemCategoryFSK:
		fmt.Fprint(w, strconv.Quote("fsk"))
	case HPElineupMallItemCategoryKeyringOther:
		fmt.Fprint(w, strconv.Quote("keyring_other"))
	case HPElineupMallItemCategoryMicrofiberTowel:
		fmt.Fprint(w, strconv.Quote("microfiber_towel"))
	case HPElineupMallItemCategoryMufflerTowel:
		fmt.Fprint(w, strconv.Quote("muffler_towel"))
	case HPElineupMallItemCategoryOther:
		fmt.Fprint(w, strconv.Quote("other"))
	case HPElineupMallItemCategoryPenlight:
		fmt.Fprint(w, strconv.Quote("penlight"))
	case HPElineupMallItemCategoryPhoto2L:
		fmt.Fprint(w, strconv.Quote("photo2_l"))
	case HPElineupMallItemCategoryPhotoA4:
		fmt.Fprint(w, strconv.Quote("photo_a4"))
	case HPElineupMallItemCategoryPhotoA5:
		fmt.Fprint(w, strconv.Quote("photo_a5"))
	case HPElineupMallItemCategoryPhotoAlbum:
		fmt.Fprint(w, strconv.Quote("photo_album"))
	case HPElineupMallItemCategoryPhotoAlbumOther:
		fmt.Fprint(w, strconv.Quote("photo_album_other"))
	case HPElineupMallItemCategoryPhotoBook:
		fmt.Fprint(w, strconv.Quote("photo_book"))
	case HPElineupMallItemCategoryPhotoBookOther:
		fmt.Fprint(w, strconv.Quote("photo_book_other"))
	case HPElineupMallItemCategoryPhotoDaily:
		fmt.Fprint(w, strconv.Quote("photo_daily"))
	case HPElineupMallItemCategoryPhotoOther:
		fmt.Fprint(w, strconv.Quote("photo_other"))
	case HPElineupMallItemCategoryTShirt:
		fmt.Fprint(w, strconv.Quote("t_shirt"))
	}
}

func (e *HPElineupMallItemCategory) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "blueray":
		*e = HPElineupMallItemCategoryBlueray
	case "clear_file":
		*e = HPElineupMallItemCategoryClearFile
	case "colllection_other":
		*e = HPElineupMallItemCategoryColllectionOther
	case "colllection_photo":
		*e = HPElineupMallItemCategoryColllectionPhoto
	case "colllection_pinnap_poster":
		*e = HPElineupMallItemCategoryColllectionPinnapPoster
	case "dvd":
		*e = HPElineupMallItemCategoryDVD
	case "dvd_magazine":
		*e = HPElineupMallItemCategoryDVDMagazine
	case "dvd_magazine_other":
		*e = HPElineupMallItemCategoryDVDMagazineOther
	case "fsk":
		*e = HPElineupMallItemCategoryFSK
	case "keyring_other":
		*e = HPElineupMallItemCategoryKeyringOther
	case "microfiber_towel":
		*e = HPElineupMallItemCategoryMicrofiberTowel
	case "muffler_towel":
		*e = HPElineupMallItemCategoryMufflerTowel
	case "other":
		*e = HPElineupMallItemCategoryOther
	case "penlight":
		*e = HPElineupMallItemCategoryPenlight
	case "photo2_l":
		*e = HPElineupMallItemCategoryPhoto2L
	case "photo_a4":
		*e = HPElineupMallItemCategoryPhotoA4
	case "photo_a5":
		*e = HPElineupMallItemCategoryPhotoA5
	case "photo_album":
		*e = HPElineupMallItemCategoryPhotoAlbum
	case "photo_album_other":
		*e = HPElineupMallItemCategoryPhotoAlbumOther
	case "photo_book":
		*e = HPElineupMallItemCategoryPhotoBook
	case "photo_book_other":
		*e = HPElineupMallItemCategoryPhotoBookOther
	case "photo_daily":
		*e = HPElineupMallItemCategoryPhotoDaily
	case "photo_other":
		*e = HPElineupMallItemCategoryPhotoOther
	case "t_shirt":
		*e = HPElineupMallItemCategoryTShirt
	}
	return nil
}

func (e HPEventSource) MarshalGQL(w io.Writer) {
	switch e {
	case HPEventSourceFCScrape:
		fmt.Fprint(w, strconv.Quote("fc_scrape"))
	}
}

func (e *HPEventSource) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "fc_scrape":
		*e = HPEventSourceFCScrape
	}
	return nil
}

func (e HPFCEventTicketApplicationSite) MarshalGQL(w io.Writer) {
	switch e {
	case HPFCEventTicketApplicationSiteHelloProject:
		fmt.Fprint(w, strconv.Quote("hello_project"))
	case HPFCEventTicketApplicationSiteMLine:
		fmt.Fprint(w, strconv.Quote("m_line"))
	}
}

func (e *HPFCEventTicketApplicationSite) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "hello_project":
		*e = HPFCEventTicketApplicationSiteHelloProject
	case "m_line":
		*e = HPFCEventTicketApplicationSiteMLine
	}
	return nil
}

func (e HPFCEventTicketApplicationStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPFCEventTicketApplicationStatusBeforeLottery:
		fmt.Fprint(w, strconv.Quote("before_lottery"))
	case HPFCEventTicketApplicationStatusCompleted:
		fmt.Fprint(w, strconv.Quote("completed"))
	case HPFCEventTicketApplicationStatusPaymentOverdue:
		fmt.Fprint(w, strconv.Quote("payment_overdue"))
	case HPFCEventTicketApplicationStatusPendingPayment:
		fmt.Fprint(w, strconv.Quote("pending_payment"))
	case HPFCEventTicketApplicationStatusRejected:
		fmt.Fprint(w, strconv.Quote("rejected"))
	case HPFCEventTicketApplicationStatusSubmitted:
		fmt.Fprint(w, strconv.Quote("submitted"))
	case HPFCEventTicketApplicationStatusUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPFCEventTicketApplicationStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "before_lottery":
		*e = HPFCEventTicketApplicationStatusBeforeLottery
	case "completed":
		*e = HPFCEventTicketApplicationStatusCompleted
	case "payment_overdue":
		*e = HPFCEventTicketApplicationStatusPaymentOverdue
	case "pending_payment":
		*e = HPFCEventTicketApplicationStatusPendingPayment
	case "rejected":
		*e = HPFCEventTicketApplicationStatusRejected
	case "submitted":
		*e = HPFCEventTicketApplicationStatusSubmitted
	case "unknown":
		*e = HPFCEventTicketApplicationStatusUnknown
	}
	return nil
}

func (e HPFollowType) MarshalGQL(w io.Writer) {
	switch e {
	case HPFollowTypeFollow:
		fmt.Fprint(w, strconv.Quote("follow"))
	case HPFollowTypeFollowWithNotification:
		fmt.Fprint(w, strconv.Quote("follow_with_notification"))
	case HPFollowTypeUnfollow:
		fmt.Fprint(w, strconv.Quote("unfollow"))
	}
}

func (e *HPFollowType) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "follow":
		*e = HPFollowTypeFollow
	case "follow_with_notification":
		*e = HPFollowTypeFollowWithNotification
	case "unfollow":
		*e = HPFollowTypeUnfollow
	}
	return nil
}

func (e HPMLStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPMLStatusExclude:
		fmt.Fprint(w, strconv.Quote("exclude"))
	case HPMLStatusInReview:
		fmt.Fprint(w, strconv.Quote("in_review"))
	case HPMLStatusNone:
		fmt.Fprint(w, strconv.Quote("none"))
	case HPMLStatusUseSample:
		fmt.Fprint(w, strconv.Quote("use_sample"))
	case HPMLStatusUseTraining:
		fmt.Fprint(w, strconv.Quote("use_training"))
	}
}

func (e *HPMLStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "exclude":
		*e = HPMLStatusExclude
	case "in_review":
		*e = HPMLStatusInReview
	case "none":
		*e = HPMLStatusNone
	case "use_sample":
		*e = HPMLStatusUseSample
	case "use_training":
		*e = HPMLStatusUseTraining
	}
	return nil
}

func (e HPMediaFaceRecognitionStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPMediaFaceRecognitionStatusError:
		fmt.Fprint(w, strconv.Quote("error"))
	case HPMediaFaceRecognitionStatusFaceAutomaticallyLabeled:
		fmt.Fprint(w, strconv.Quote("face_automatically_labeled"))
	case HPMediaFaceRecognitionStatusFaceDetected:
		fmt.Fprint(w, strconv.Quote("face_detected"))
	case HPMediaFaceRecognitionStatusFaceManuallyLabeled:
		fmt.Fprint(w, strconv.Quote("face_manually_labeled"))
	case HPMediaFaceRecognitionStatusUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPMediaFaceRecognitionStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "error":
		*e = HPMediaFaceRecognitionStatusError
	case "face_automatically_labeled":
		*e = HPMediaFaceRecognitionStatusFaceAutomaticallyLabeled
	case "face_detected":
		*e = HPMediaFaceRecognitionStatusFaceDetected
	case "face_manually_labeled":
		*e = HPMediaFaceRecognitionStatusFaceManuallyLabeled
	case "unknown":
		*e = HPMediaFaceRecognitionStatusUnknown
	}
	return nil
}

func (e HPMediaStatus) MarshalGQL(w io.Writer) {
	switch e {
	case HPMediaStatusError:
		fmt.Fprint(w, strconv.Quote("error"))
	case HPMediaStatusNeedDownload:
		fmt.Fprint(w, strconv.Quote("need_download"))
	case HPMediaStatusReadyToHost:
		fmt.Fprint(w, strconv.Quote("ready_to_host"))
	case HPMediaStatusUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	}
}

func (e *HPMediaStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "error":
		*e = HPMediaStatusError
	case "need_download":
		*e = HPMediaStatusNeedDownload
	case "ready_to_host":
		*e = HPMediaStatusReadyToHost
	case "unknown":
		*e = HPMediaStatusUnknown
	}
	return nil
}

func (e HPMediaType) MarshalGQL(w io.Writer) {
	switch e {
	case HPMediaTypeImage:
		fmt.Fprint(w, strconv.Quote("image"))
	case HPMediaTypeUnknown:
		fmt.Fprint(w, strconv.Quote("unknown"))
	case HPMediaTypeVideo:
		fmt.Fprint(w, strconv.Quote("video"))
	}
}

func (e *HPMediaType) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "image":
		*e = HPMediaTypeImage
	case "unknown":
		*e = HPMediaTypeUnknown
	case "video":
		*e = HPMediaTypeVideo
	}
	return nil
}

func (e TestEnum) MarshalGQL(w io.Writer) {
	switch e {
	case TestEnumA:
		fmt.Fprint(w, strconv.Quote("a"))
	case TestEnumB:
		fmt.Fprint(w, strconv.Quote("b"))
	case TestEnumC:
		fmt.Fprint(w, strconv.Quote("c"))
	}
}

func (e *TestEnum) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "a":
		*e = TestEnumA
	case "b":
		*e = TestEnumB
	case "c":
		*e = TestEnumC
	}
	return nil
}

func (e UserNotificationStatus) MarshalGQL(w io.Writer) {
	switch e {
	case UserNotificationStatusError:
		fmt.Fprint(w, strconv.Quote("error"))
	case UserNotificationStatusPrepared:
		fmt.Fprint(w, strconv.Quote("prepared"))
	case UserNotificationStatusSent:
		fmt.Fprint(w, strconv.Quote("sent"))
	}
}

func (e *UserNotificationStatus) UnmarshalGQL(v interface{}) error {
	switch v.(string) {
	case "error":
		*e = UserNotificationStatusError
	case "prepared":
		*e = UserNotificationStatusPrepared
	case "sent":
		*e = UserNotificationStatusSent
	}
	return nil
}


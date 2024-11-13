package enums



func (HPAssetType) Values() (types []string) {

	for _, r := range []HPAssetType{
		HPAssetTypeAmeblo,
		HPAssetTypeElineupMall,
		HPAssetTypeInstagram,
		HPAssetTypeTiktok,
		HPAssetTypeTwitter,
		HPAssetTypeYoutube,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPBlobFaceRecognitionStatus) Values() (types []string) {

	for _, r := range []HPBlobFaceRecognitionStatus{
		HPBlobFaceRecognitionStatusError,
		HPBlobFaceRecognitionStatusFaceAutomaticallyLabeled,
		HPBlobFaceRecognitionStatusFaceDetected,
		HPBlobFaceRecognitionStatusFaceManuallyLabeled,
		HPBlobFaceRecognitionStatusUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPBlobStatus) Values() (types []string) {

	for _, r := range []HPBlobStatus{
		HPBlobStatusError,
		HPBlobStatusNeedDownload,
		HPBlobStatusReadyToHost,
		HPBlobStatusUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPBlobSubType) Values() (types []string) {

	for _, r := range []HPBlobSubType{
		HPBlobSubTypeHtml,
		HPBlobSubTypeJpeg,
		HPBlobSubTypeMp4,
		HPBlobSubTypeUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPBlobType) Values() (types []string) {

	for _, r := range []HPBlobType{
		HPBlobTypeImage,
		HPBlobTypeText,
		HPBlobTypeUnknown,
		HPBlobTypeVideo,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPElineupMallItemCategory) Values() (types []string) {

	for _, r := range []HPElineupMallItemCategory{
		HPElineupMallItemCategoryBlueray,
		HPElineupMallItemCategoryClearFile,
		HPElineupMallItemCategoryColllectionOther,
		HPElineupMallItemCategoryColllectionPhoto,
		HPElineupMallItemCategoryColllectionPinnapPoster,
		HPElineupMallItemCategoryDVD,
		HPElineupMallItemCategoryDVDMagazine,
		HPElineupMallItemCategoryDVDMagazineOther,
		HPElineupMallItemCategoryFSK,
		HPElineupMallItemCategoryKeyringOther,
		HPElineupMallItemCategoryMicrofiberTowel,
		HPElineupMallItemCategoryMufflerTowel,
		HPElineupMallItemCategoryOther,
		HPElineupMallItemCategoryPenlight,
		HPElineupMallItemCategoryPhoto2L,
		HPElineupMallItemCategoryPhotoA4,
		HPElineupMallItemCategoryPhotoA5,
		HPElineupMallItemCategoryPhotoAlbum,
		HPElineupMallItemCategoryPhotoAlbumOther,
		HPElineupMallItemCategoryPhotoBook,
		HPElineupMallItemCategoryPhotoBookOther,
		HPElineupMallItemCategoryPhotoDaily,
		HPElineupMallItemCategoryPhotoOther,
		HPElineupMallItemCategoryTShirt,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPEventSource) Values() (types []string) {

	for _, r := range []HPEventSource{
		HPEventSourceFCScrape,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPFCEventTicketApplicationSite) Values() (types []string) {

	for _, r := range []HPFCEventTicketApplicationSite{
		HPFCEventTicketApplicationSiteHelloProject,
		HPFCEventTicketApplicationSiteMLine,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPFCEventTicketApplicationStatus) Values() (types []string) {

	for _, r := range []HPFCEventTicketApplicationStatus{
		HPFCEventTicketApplicationStatusBeforeLottery,
		HPFCEventTicketApplicationStatusCompleted,
		HPFCEventTicketApplicationStatusPaymentOverdue,
		HPFCEventTicketApplicationStatusPendingPayment,
		HPFCEventTicketApplicationStatusRejected,
		HPFCEventTicketApplicationStatusSubmitted,
		HPFCEventTicketApplicationStatusUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPFollowType) Values() (types []string) {

	for _, r := range []HPFollowType{
		HPFollowTypeFollow,
		HPFollowTypeFollowWithNotification,
		HPFollowTypeUnfollow,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPMLStatus) Values() (types []string) {

	for _, r := range []HPMLStatus{
		HPMLStatusExclude,
		HPMLStatusInReview,
		HPMLStatusNone,
		HPMLStatusUseSample,
		HPMLStatusUseTraining,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPMediaFaceRecognitionStatus) Values() (types []string) {

	for _, r := range []HPMediaFaceRecognitionStatus{
		HPMediaFaceRecognitionStatusError,
		HPMediaFaceRecognitionStatusFaceAutomaticallyLabeled,
		HPMediaFaceRecognitionStatusFaceDetected,
		HPMediaFaceRecognitionStatusFaceManuallyLabeled,
		HPMediaFaceRecognitionStatusUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPMediaStatus) Values() (types []string) {

	for _, r := range []HPMediaStatus{
		HPMediaStatusError,
		HPMediaStatusNeedDownload,
		HPMediaStatusReadyToHost,
		HPMediaStatusUnknown,
	} {
		types = append(types, string(r))
	}
	return
}

func (HPMediaType) Values() (types []string) {

	for _, r := range []HPMediaType{
		HPMediaTypeImage,
		HPMediaTypeUnknown,
		HPMediaTypeVideo,
	} {
		types = append(types, string(r))
	}
	return
}

func (TestEnum) Values() (types []string) {

	for _, r := range []TestEnum{
		TestEnumA,
		TestEnumB,
		TestEnumC,
	} {
		types = append(types, string(r))
	}
	return
}

func (UserNotificationStatus) Values() (types []string) {

	for _, r := range []UserNotificationStatus{
		UserNotificationStatusError,
		UserNotificationStatusPrepared,
		UserNotificationStatusSent,
	} {
		types = append(types, string(r))
	}
	return
}

package enums

type HPMLStatus string

const (
	HPMLStatusNone        HPMLStatus = "none"         // nothing confirmed
	HPMLStatusUseTraining HPMLStatus = "use_training" // confirmed the label is correct
	HPMLStatusUseSample   HPMLStatus = "use_samples"  // confirmed the label is correct but use as samples.
	HPMLStatusInReview    HPMLStatus = "in_review"    // someone is reviewing the label
	HPMLStatusExclude     HPMLStatus = "exclude"      // label is correct but excluded from the training model
)

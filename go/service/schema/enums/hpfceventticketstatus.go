package enums

type HPFCEventTicketApplicationStatus string

const (
	HPFCEventTicketApplicationStatusUnknown        HPFCEventTicketApplicationStatus = "Unknown"
	HPFCEventTicketApplicationStatusSubmitted      HPFCEventTicketApplicationStatus = "Submitted"
	HPFCEventTicketApplicationStatusBeforeLottery  HPFCEventTicketApplicationStatus = "BeforeLottery"
	HPFCEventTicketApplicationStatusPendingPayment HPFCEventTicketApplicationStatus = "PendingPayment"
	HPFCEventTicketApplicationStatusCompleted      HPFCEventTicketApplicationStatus = "Completed"
	HPFCEventTicketApplicationStatusRejected       HPFCEventTicketApplicationStatus = "Rejected"
	HPFCEventTicketApplicationStatusPaymentOverdue HPFCEventTicketApplicationStatus = "PaymentOverdue"
)

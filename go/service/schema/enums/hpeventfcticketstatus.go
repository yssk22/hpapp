package enums

type HPEventFCTicketStatus string

const (
	HPEventFCTicketStatusUnknown        HPEventFCTicketStatus = "Unknown"
	HPEventFCTicketStatusSubmitted      HPEventFCTicketStatus = "Submitted"
	HPEventFCTicketStatusBeforeLottery  HPEventFCTicketStatus = "BeforeLottery"
	HPEventFCTicketStatusPendingPayment HPEventFCTicketStatus = "PendingPayment"
	HPEventFCTicketStatusCompleted      HPEventFCTicketStatus = "Completed"
	HPEventFCTicketStatusRejected       HPEventFCTicketStatus = "Rejected"
	HPEventFCTicketStatusPaymentOverdue HPEventFCTicketStatus = "PaymentOverdue"
)

package enums

type HPEventFCTicketStatus string

const (
	HPEventFCTicketStatusUnknown        HPEventFCTicketStatus = "Unknown"
	HPEventFCTicketStatusSubmitted      HPEventFCTicketStatus = "Submitted"
	HPEventFCTicketStatusPendingPayment HPEventFCTicketStatus = "PendingPayment"
	HPEventFCTicketStatusCompleted      HPEventFCTicketStatus = "Completed"
	HPEventFCTicketStatusRejected       HPEventFCTicketStatus = "Rejected"
	HPEventFCTicketStatusPaymentOverdue HPEventFCTicketStatus = "PaymentOverdue"
)

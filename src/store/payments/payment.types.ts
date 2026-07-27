export type PaymentStatus =
     | "pending"
     | "success"
     | "failed"
     | "cancelled"
     | "expired"

export type PaymentStatusApi = {
     uuid: string
     status: PaymentStatus
     paid_at: string | null
     gateway_transaction_id: string | null
     receipt_number: string | null
     raw_response: unknown
     payment_method: string | null
     transaction_reference: string | null
     created_at: string
     updated_at: string
}

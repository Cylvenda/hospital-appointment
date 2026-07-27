import api from "../axios"
import { API_ENDPOINTS } from "../endpoints"
import type { ApiResponse } from "../types"

export type PaymentStatusApi = {
    uuid: string
    status: "pending" | "success" | "failed" | "cancelled" | "expired"
    paid_at: string | null
    gateway_transaction_id: string | null
    receipt_number: string | null
    raw_response: unknown
    payment_method: string | null
    transaction_reference: string | null
    created_at: string
    updated_at: string
}

export const paymentService = {
    async createPayment(
        appointmentId: string,
        phone?: string
    ): Promise<ApiResponse<{ payment_uuid: string; reference: string; status: string }>> {
        const response = await api.post<{ payment_uuid: string; reference: string; status: string }>(
            API_ENDPOINTS.PAYMENTS_CREATE,
            { appointment_uuid: appointmentId, phone }
        )
        return { status: response.status, data: response.data }
    },

    async getPaymentStatus(
        paymentUuid: string
    ): Promise<ApiResponse<PaymentStatusApi>> {
        const response = await api.get<PaymentStatusApi>(
            API_ENDPOINTS.PAYMENT_STATUS.replace("{uuid}", paymentUuid)
        )
        return { status: response.status, data: response.data }
    },
}

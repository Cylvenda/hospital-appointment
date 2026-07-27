import { create } from "zustand"
import type { AxiosError } from "axios"
import { paymentService } from "@/api/services/payment.service"

import type { PaymentStatus } from "./payment.types"

type PaymentStore = {
  createPayment: (appointmentId: string, phone?: string) => Promise<string | null>
  getPaymentStatus: (paymentUuid: string) => Promise<PaymentStatus>
}

type PaymentErrorResponse = {
  code?: string
  detail?: string
  retryable?: boolean
}

export class PaymentTemporarilyUnavailableError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "PaymentTemporarilyUnavailableError"
  }
}

function getApiError(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<PaymentErrorResponse>
  const detail = axiosError.response?.data?.detail
  const isTemporarilyUnavailable =
    axiosError.response?.data?.code === "payment_temporarily_unavailable" ||
    axiosError.response?.status === 502 ||
    axiosError.response?.status === 503

  if (isTemporarilyUnavailable) {
    return new PaymentTemporarilyUnavailableError(
      typeof detail === "string" && detail.trim()
        ? detail
        : "Payment is temporarily unavailable. Please try again later."
    )
  }

  if (typeof detail === "string" && detail.trim()) {
    return new Error(detail)
  }
  return new Error(error instanceof Error ? error.message : fallback)
}

export const usePaymentStore = create<PaymentStore>(() => ({
  createPayment: async (appointmentId, phone) => {
    try {
      const response = await paymentService.createPayment(appointmentId, phone)
      return response.data.payment_uuid
    } catch (error: unknown) {
      throw getApiError(error, "Payment initiation failed")
    }
  },

  getPaymentStatus: async (paymentUuid) => {
    const response = await paymentService.getPaymentStatus(paymentUuid)
    return response.data.status
  },
}))

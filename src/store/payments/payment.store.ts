import { create } from "zustand"
import type { AxiosError } from "axios"
import { paymentService } from "@/api/services/payment.service"

import type { PaymentStatus } from "./payment.types"

type PaymentStore = {
  createPayment: (appointmentId: string, phone?: string) => Promise<string | null>
  getPaymentStatus: (paymentUuid: string) => Promise<PaymentStatus>
}

function getApiErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<{ detail?: string }>
  const detail = axiosError.response?.data?.detail
  if (typeof detail === "string" && detail.trim()) {
    return detail
  }
  return error instanceof Error ? error.message : fallback
}

export const usePaymentStore = create<PaymentStore>(() => ({
  createPayment: async (appointmentId, phone) => {
    try {
      const response = await paymentService.createPayment(appointmentId, phone)
      return response.data.payment_uuid
    } catch (error: unknown) {
      const message = getApiErrorMessage(error, "Payment initiation failed")
      throw new Error(message)
    }
  },

  getPaymentStatus: async (paymentUuid) => {
    const response = await paymentService.getPaymentStatus(paymentUuid)
    return response.data.status
  },
}))

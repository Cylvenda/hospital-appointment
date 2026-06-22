import api from "../axios"
import type { ApiResponse } from "../types"
import type {
    ContentCategoryApi,
    EducationalContentApi,
    ContentBookmarkApi,
} from "@/store/health-education/health-education.types"

export const healthEducationService = {
    async getCategories(): Promise<ApiResponse<ContentCategoryApi[]>> {
        const response = await api.get<ContentCategoryApi[]>("/education/categories/")
        return {
            status: response.status,
            data: response.data,
        }
    },

    async getContents(params?: { category?: string; search?: string }): Promise<ApiResponse<EducationalContentApi[]>> {
        const response = await api.get<EducationalContentApi[]>("/education/contents/", { params })
        return {
            status: response.status,
            data: response.data,
        }
    },

    async getContentBySlug(slug: string): Promise<ApiResponse<EducationalContentApi>> {
        const response = await api.get<EducationalContentApi>(`/education/contents/${slug}/`)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async getBookmarks(): Promise<ApiResponse<ContentBookmarkApi[]>> {
        const response = await api.get<ContentBookmarkApi[]>("/education/bookmarks/")
        return {
            status: response.status,
            data: response.data,
        }
    },

    async toggleBookmark(slug: string): Promise<ApiResponse<{ status: string }>> {
        const response = await api.post<{ status: string }>(`/education/contents/${slug}/bookmark/`)
        return {
            status: response.status,
            data: response.data,
        }
    },

    async toggleReaction(slug: string, reaction: "LIKE" | "HELPFUL"): Promise<ApiResponse<{ status: string; reaction?: string }>> {
        const response = await api.post<{ status: string; reaction?: string }>(`/education/contents/${slug}/react/`, { reaction })
        return {
            status: response.status,
            data: response.data,
        }
    },

    // Admin/Receptionist Management Methods
    async createContent(payload: FormData): Promise<ApiResponse<EducationalContentApi>> {
        const response = await api.post<EducationalContentApi>("/education/contents/", payload)
        return { status: response.status, data: response.data }
    },

    async updateContent(slug: string, payload: FormData): Promise<ApiResponse<EducationalContentApi>> {
        const response = await api.patch<EducationalContentApi>(`/education/contents/${slug}/`, payload)
        return { status: response.status, data: response.data }
    },

    async deleteContent(slug: string): Promise<ApiResponse<void>> {
        const response = await api.delete<void>(`/education/contents/${slug}/`)
        return { status: response.status, data: response.data }
    },

    async createCategory(payload: Partial<ContentCategoryApi>): Promise<ApiResponse<ContentCategoryApi>> {
        const response = await api.post<ContentCategoryApi>("/education/categories/", payload)
        return { status: response.status, data: response.data }
    },

    async updateCategory(slug: string, payload: Partial<ContentCategoryApi>): Promise<ApiResponse<ContentCategoryApi>> {
        const response = await api.patch<ContentCategoryApi>(`/education/categories/${slug}/`, payload)
        return { status: response.status, data: response.data }
    },

    async deleteCategory(slug: string): Promise<ApiResponse<void>> {
        const response = await api.delete<void>(`/education/categories/${slug}/`)
        return { status: response.status, data: response.data }
    }
}

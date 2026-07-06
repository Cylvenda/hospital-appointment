import { create } from "zustand"
import axios from "axios"
import { healthEducationService } from "@/api/services/health-education.service"
import type {
    ContentCategory,
    EducationalContent,
    ContentBookmark,
    ContentCategoryApi,
    EducationalContentApi,
    ContentBookmarkApi,
    ContentTagApi,
    ContentTag
} from "./health-education.types"

type HealthEducationStore = {
    categories: ContentCategory[]
    contents: EducationalContent[]
    bookmarks: ContentBookmark[]
    loading: boolean
    error: string | null
    initialized: boolean
    fetchCategories: () => Promise<void>
    fetchContents: (params?: { category?: string; search?: string }) => Promise<void>
    fetchBookmarks: () => Promise<void>
    initialize: () => Promise<void>
    toggleBookmark: (slug: string) => Promise<void>
    createContent: (payload: FormData) => Promise<void>
    updateContent: (slug: string, payload: FormData) => Promise<void>
    deleteContent: (slug: string) => Promise<void>
    createCategory: (payload: Partial<ContentCategoryApi>) => Promise<void>
    updateCategory: (slug: string, payload: Partial<ContentCategoryApi>) => Promise<void>
    deleteCategory: (slug: string) => Promise<void>
}

export function mapCategory(apiObj: ContentCategoryApi): ContentCategory {
    return {
        id: apiObj.uuid,
        name: apiObj.name,
        slug: apiObj.slug,
        description: apiObj.description,
        isActive: apiObj.is_active,
    }
}

export function mapTag(apiObj: ContentTagApi): ContentTag {
    return {
        id: apiObj.uuid,
        name: apiObj.name,
    }
}

export function mapContent(apiObj: EducationalContentApi): EducationalContent {
    return {
        id: apiObj.uuid,
        title: apiObj.title,
        slug: apiObj.slug,
        summary: apiObj.summary,
        content: apiObj.content,
        category: mapCategory(apiObj.category),
        tags: apiObj.tags ? apiObj.tags.map(mapTag) : [],
        authorName: apiObj.author_name,
        featuredImage: apiObj.featured_image,
        contentType: apiObj.content_type,
        status: apiObj.status,
        publishedAt: apiObj.published_at,
        createdAt: apiObj.created_at,
        updatedAt: apiObj.updated_at,
    }
}

export function mapBookmark(apiObj: ContentBookmarkApi): ContentBookmark {
    return {
        id: apiObj.uuid,
        content: mapContent(apiObj.content),
        createdAt: apiObj.created_at,
    }
}

function getApiErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError<unknown>(error) && error.response?.data) {
        const data = error.response.data
        if (
            typeof data === "object" &&
            data !== null &&
            "detail" in data &&
            typeof data.detail === "string" &&
            data.detail.trim()
        ) {
            return data.detail
        }
        if (typeof data === "object" && data !== null) {
            // DRF Validation Errors look like { "featured_image": ["Upload a valid image..."] }
            const values = Object.values(data).flat()
            if (values.length > 0 && typeof values[0] === "string") {
                return values[0]
            }
        }
    }
    return error instanceof Error ? error.message : fallback
}

export const useHealthEducationStore = create<HealthEducationStore>((set, get) => ({
    categories: [],
    contents: [],
    bookmarks: [],
    loading: false,
    error: null,
    initialized: false,

    fetchCategories: async () => {
        set({ loading: true, error: null })
        try {
            const response = await healthEducationService.getCategories()
            set({ categories: response.data.map(mapCategory), loading: false })
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to fetch categories"), loading: false })
        }
    },

    fetchContents: async (params) => {
        set({ loading: true, error: null })
        try {
            const response = await healthEducationService.getContents(params)
            set({ contents: response.data.map(mapContent), loading: false })
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to fetch content"), loading: false })
        }
    },

    fetchBookmarks: async () => {
        set({ loading: true, error: null })
        try {
            const response = await healthEducationService.getBookmarks()
            set({ bookmarks: response.data.map(mapBookmark), loading: false })
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to fetch bookmarks"), loading: false })
        }
    },

    initialize: async () => {
        set({ loading: true, error: null })
        try {
            const [categoriesRes, contentsRes, bookmarksRes] = await Promise.all([
                healthEducationService.getCategories(),
                healthEducationService.getContents(),
                healthEducationService.getBookmarks()
            ])
            set({
                categories: categoriesRes.data.map(mapCategory),
                contents: contentsRes.data.map(mapContent),
                bookmarks: bookmarksRes.data.map(mapBookmark),
                loading: false,
                initialized: true,
            })
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to load health education data"), loading: false, initialized: true })
        }
    },

    toggleBookmark: async (slug: string) => {
        try {
            await healthEducationService.toggleBookmark(slug)
            await get().fetchBookmarks()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to toggle bookmark") })
            throw error
        }
    },

    createContent: async (payload: FormData) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.createContent(payload)
            await get().fetchContents()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to create content"), loading: false })
            throw error
        }
    },

    updateContent: async (slug: string, payload: FormData) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.updateContent(slug, payload)
            await get().fetchContents()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to update content"), loading: false })
            throw error
        }
    },

    deleteContent: async (slug: string) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.deleteContent(slug)
            await get().fetchContents()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to delete content"), loading: false })
            throw error
        }
    },

    createCategory: async (payload) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.createCategory(payload)
            await get().fetchCategories()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to create category"), loading: false })
            throw error
        }
    },

    updateCategory: async (slug, payload) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.updateCategory(slug, payload)
            await get().fetchCategories()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to update category"), loading: false })
            throw error
        }
    },

    deleteCategory: async (slug) => {
        set({ loading: true, error: null })
        try {
            await healthEducationService.deleteCategory(slug)
            await get().fetchCategories()
        } catch (error) {
            set({ error: getApiErrorMessage(error, "Failed to delete category"), loading: false })
            throw error
        }
    }
}))

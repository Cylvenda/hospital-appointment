export interface ContentCategoryApi {
    uuid: string;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
}

export interface ContentTagApi {
    uuid: string;
    name: string;
}

export interface EducationalContentApi {
    uuid: string;
    title: string;
    slug: string;
    summary: string;
    content?: string;
    category: ContentCategoryApi;
    tags: ContentTagApi[];
    author_name: string;
    featured_image: string | null;
    content_type: "ARTICLE" | "VIDEO" | "INFOGRAPHIC" | "FAQ";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    published_at: string | null;
    created_at: string;
    updated_at?: string;
}

export interface ContentBookmarkApi {
    uuid: string;
    content: EducationalContentApi;
    created_at: string;
}

// Client Side Models
export interface ContentCategory {
    id: string;
    name: string;
    slug: string;
    description: string;
    isActive: boolean;
}

export interface ContentTag {
    id: string;
    name: string;
}

export interface EducationalContent {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content?: string;
    category: ContentCategory;
    tags: ContentTag[];
    authorName: string;
    featuredImage: string | null;
    contentType: "ARTICLE" | "VIDEO" | "INFOGRAPHIC" | "FAQ";
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt: string | null;
    createdAt: string;
    updatedAt?: string;
}

export interface ContentBookmark {
    id: string;
    content: EducationalContent;
    createdAt: string;
}

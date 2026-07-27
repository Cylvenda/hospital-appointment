import { NextRequest, NextResponse } from "next/server"

const BACKEND_API_ROOT = normalizeApiRoot(
     process.env.BACKEND_API_BASE || "http://127.0.0.1:8000/api/"
)

const ACCESS_COOKIE_MAX_AGE = 60 * 10
const REFRESH_COOKIE_MAX_AGE = 60 * 60 * 24

function normalizeApiRoot(value: string) {
     return value.endsWith("/") ? value : `${value}/`
}

function buildBackendUrl(pathSegments: string[], request: NextRequest) {
     const cleanSegments = pathSegments.filter(Boolean)
     const pathname = cleanSegments.join("/")
     const url = new URL(`${pathname}/`, BACKEND_API_ROOT)
     url.search = request.nextUrl.search
     return url
}

function getCookieOptions(maxAge: number) {
     return {
          httpOnly: true,
          sameSite: "lax" as const,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge,
     }
}

function allowsResponseBody(status: number) {
     return ![204, 205, 304].includes(status)
}

function strToArrayBuffer(text: string): ArrayBuffer {
     return new TextEncoder().encode(text).buffer
}

function parseCookies(cookieHeader: string | null): Record<string, string> {
     const result: Record<string, string> = {}
     if (!cookieHeader) return result
     cookieHeader.split(";").forEach((cookie) => {
          const [name, ...rest] = cookie.split("=")
          if (name) {
               result[name.trim()] = decodeURIComponent(rest.join("=").trim())
          }
     })
     return result
}

async function proxy(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
     const { path } = await context.params
     const targetUrl = buildBackendUrl(path, request)
     const cookieHeader = request.headers.get("cookie")
     const contentType = request.headers.get("content-type")

     const headers = new Headers()
     if (cookieHeader) {
          headers.set("cookie", cookieHeader)
     }
     if (contentType) {
          headers.set("content-type", contentType)
     }
     headers.set("accept", "application/json")

     const isRefresh = path.join("/") === "me/auth/token/refresh"

      let body: ArrayBuffer | undefined
      if (request.method === "GET" || request.method === "HEAD") {
           body = undefined
      } else {
           const rawText = await request.text()
           if (isRefresh && rawContentTypeIncludesJson(contentType)) {
                const cookies = parseCookies(cookieHeader)
                const refreshToken = cookies.refresh
                if (refreshToken) {
                     let payload: Record<string, unknown> = {}
                     try {
                          payload = JSON.parse(rawText) as Record<string, unknown>
                     } catch {}
                     if (!payload.refresh) {
                          payload.refresh = refreshToken
                     }
                     body = strToArrayBuffer(JSON.stringify(payload))
                } else {
                     body = rawText ? strToArrayBuffer(rawText) : undefined
                }
           } else {
                body = rawText ? strToArrayBuffer(rawText) : undefined
           }
      }

      const backendResponse = await fetch(targetUrl, {
           method: request.method,
           headers,
           body,
           cache: "no-store",
      })

     const rawContentType = backendResponse.headers.get("content-type") || "application/json"
     const responseText = await backendResponse.text()
     const response = allowsResponseBody(backendResponse.status)
          ? new NextResponse(responseText, {
                 status: backendResponse.status,
                 headers: {
                      "content-type": rawContentType,
                 },
            })
          : new NextResponse(null, {
                 status: backendResponse.status,
            })

     const isLogin = path.join("/") === "me/auth/login"
     const isLogout = path.join("/") === "me/auth/logout"

     let parsedBody: Record<string, unknown> | null = null
     if (rawContentType.includes("application/json") && responseText) {
          try {
               parsedBody = JSON.parse(responseText) as Record<string, unknown>
          } catch {
               parsedBody = null
          }
     }

     if ((isLogin || isRefresh) && parsedBody) {
          const accessToken =
               typeof parsedBody.access === "string" ? parsedBody.access : null
          const refreshToken =
               typeof parsedBody.refresh === "string" ? parsedBody.refresh : null

          if (accessToken) {
               response.cookies.set("access", accessToken, getCookieOptions(ACCESS_COOKIE_MAX_AGE))
          }

          if (refreshToken) {
               response.cookies.set("refresh", refreshToken, getCookieOptions(REFRESH_COOKIE_MAX_AGE))
          }
     }

     if (isLogout) {
          response.cookies.delete("access")
          response.cookies.delete("refresh")
     }

     return response
}

function rawContentTypeIncludesJson(contentType: string | null) {
     return (contentType || "").includes("application/json")
}

export async function GET(
     request: NextRequest,
     context: { params: Promise<{ path: string[] }> }
) {
     return proxy(request, context)
}

export async function POST(
     request: NextRequest,
     context: { params: Promise<{ path: string[] }> }
) {
     return proxy(request, context)
}

export async function PATCH(
     request: NextRequest,
     context: { params: Promise<{ path: string[] }> }
) {
     return proxy(request, context)
}

export async function PUT(
     request: NextRequest,
     context: { params: Promise<{ path: string[] }> }
) {
     return proxy(request, context)
}

export async function DELETE(
     request: NextRequest,
     context: { params: Promise<{ path: string[] }> }
) {
     return proxy(request, context)
}

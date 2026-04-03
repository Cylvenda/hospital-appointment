const apiRootFromEnv = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/"
const normalizedApiRoot = apiRootFromEnv.endsWith("/") ? apiRootFromEnv : `${apiRootFromEnv}/`

export const API_ENDPOINTS = {
     // root api endpoint
     API_ROOT: normalizedApiRoot,

     // User Authentication Endpoints
     USER_REGISTRATION: "auth/users/",
     USER_LOGIN: "me/auth/login/",
     USER_TOKEN_REFRESH: "me/auth/csrf/",
     USER_TOKEN_VERIFY: "me/auth/refresh/",
     USER_LOGOUT: "me/auth/logout/",

     // User activation and password management
     USER_ACCOUNT_ACTIVATION: "auth/users/activation/",
     USER_RESEND_ACTIVATION_EMAIL: "auth/users/resend_activation/",
     USER_PASSWORD_RESET: "auth/users/reset_password/",
     USER_PASSWORD_RESET_CONFIRM: "auth/users/reset_password_confirm/",

     // Current user
     CURRENT_USER_PROFILE: "auth/users/me/",
}

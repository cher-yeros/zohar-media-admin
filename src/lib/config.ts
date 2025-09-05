/**
 * Application configuration
 */

export const config = {
  // API Configuration
  graphqlEndpoint:
    import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",

  // File Upload Configuration
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedImageTypes: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  allowedVideoTypes: ["video/mp4", "video/webm", "video/quicktime"],

  // Pagination defaults
  defaultPageSize: 10,
  maxPageSize: 100,

  // Authentication
  tokenKey: "auth-token",
  userKey: "auth-user",
} as const;

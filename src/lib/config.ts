/**
 * Application configuration
 */

const PRODUCTION_API_ORIGIN = "https://api.zoharmedia.net";
const DEV_API_ORIGIN = "http://localhost:4000";

export const config = {
  // API Configuration (env wins; production builds default to api.zoharmedia.net)
  graphqlEndpoint:
    import.meta.env.VITE_GRAPHQL_ENDPOINT ||
    (import.meta.env.PROD
      ? `${PRODUCTION_API_ORIGIN}/graphql`
      : `${DEV_API_ORIGIN}/graphql`),
  apiBaseUrl:
    import.meta.env.VITE_API_BASE_URL ||
    (import.meta.env.PROD ? PRODUCTION_API_ORIGIN : DEV_API_ORIGIN),

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

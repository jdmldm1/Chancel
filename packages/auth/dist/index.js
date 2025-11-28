export * from "./password";
export * from "./validation";
export * from "./jwt";
export const AUTH_SECRET = process.env.AUTH_SECRET || "your-secret-key";
export const JWT_EXPIRY = "7d";

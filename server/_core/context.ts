// server/_core/context.ts
import { verifyToken, getAdminById, type AdminUser } from "./auth";
import { parse as parseCookie } from "cookie";

export type TrpcContext = {
  req: any;
  res: any;
  user: AdminUser | null;
};

export async function createContext(opts: { req: any; res: any }): Promise<TrpcContext> {
  let user: AdminUser | null = null;

  try {
    // Get token from cookie or Authorization header
    let token: string | null = null;

    // Try to get token from cookie
    const cookieHeader = opts.req.headers?.cookie || opts.req.headers?.["cookie"];
    if (cookieHeader && typeof cookieHeader === 'string') {
      try {
        const cookies = parseCookie(cookieHeader);
        token = cookies.adminToken || null;
      } catch (cookieError) {
        console.error("Error parsing cookie:", cookieError);
      }
    }

    // If no cookie, try Authorization header
    if (!token) {
      const authHeader = opts.req.headers?.authorization || opts.req.headers?.["Authorization"];
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    // Verify token and get user
    if (token) {
      try {
        const payload = verifyToken(token);
        if (payload && payload.userId) {
          user = await getAdminById(payload.userId);
        }
      } catch (tokenError) {
        // Token is invalid or expired - this is normal, just set user to null
        console.log("Token verification failed (user not authenticated)");
        user = null;
      }
    }
  } catch (error) {
    // Log error but don't throw - return null user instead
    console.error("Error creating context:", error);
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}

export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = "InfinityX";

// Hardcoded logo path - no need to update via admin panel
export const APP_LOGO = "/uploads/infinity_x_logo-removebg-preview.png";

// Simple login URL for JWT authentication (no OAuth)
export const getLoginUrl = () => {
  return "/admin-login";
};

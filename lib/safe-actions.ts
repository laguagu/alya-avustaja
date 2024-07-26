import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    return "Server returned an error: " + e.message;
  },
  handleServerErrorLog(e) {
    console.error("Server error", e);
  },
  throwValidationErrors: true,
});

import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e, utils) {
    // Log the error
    console.error("Server error", e);

    // Return the error message to the client
    return "Server returned an error: " + e.message;
  },
  throwValidationErrors: true,
});

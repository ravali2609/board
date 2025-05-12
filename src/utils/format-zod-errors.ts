import type { ZodError, ZodIssue } from "zod";

/**
 * Transforms a ZodError into a flat object mapping field paths to error messages.
 * Handles nested paths like ['user', 'email']
 */
export function formatZodErrors(error: ZodError): Record<string, string> {
  return error.issues.reduce((acc: Record<string, string>, issue: ZodIssue) => {
    const field = issue.path.join(".");
    if (field) {
      acc[field] = issue.message;
    }
    return acc;
  }, {});
}

/**
 * Build a user-facing error message from an API error response.
 *
 * @param {Object}  error     - The error object thrown by RTK Query (.status)
 * @param {string}  context   - Short verb phrase describing the action (e.g. "awarding", "creating")
 * @param {Object}  overrides - Optional map of HTTP status codes to custom messages
 * @returns {string} A human-readable error message
 */
export function getApiErrorMessage(error, context, overrides = {}) {
  const defaults = {
    400: "Verify the requested fields",
    401: `Try authenticating before ${context}`,
    403: "Ensure permissions are available",
    500: `Attempt ${context} again later`,
  };
  const messages = { ...defaults, ...overrides };
  return messages[error?.status] || `Failed during ${context}`;
}

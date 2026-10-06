import {
  APIError,
  AuthenticationError,
  ErrorDeletingFile,
  FileRetrievalError,
  FileUploadError,
  Forbidden,
  Locked,
  LockedAuth,
  MissingFile,
  NotFound,
  QueryError,
  UnverifiedEmail,
  ValidationError,
} from 'payload';

/**
 * Payload sets `err.name = this.constructor.name` and picks the log level from
 * `config.loggingLevels[err.name]` (Forbidden / NotFound / ValidationError ...
 * default to 'info'). The production server bundle minifies class names
 * (`class l extends APIError`), so every guest 403 on /api/* was logged as an
 * ERROR. Restoring the real names makes `loggingLevels` work again.
 * Idempotent; imported once by payload.config.ts.
 */
const NAMED = {
  APIError,
  AuthenticationError,
  ErrorDeletingFile,
  FileRetrievalError,
  FileUploadError,
  Forbidden,
  Locked,
  LockedAuth,
  MissingFile,
  NotFound,
  QueryError,
  UnverifiedEmail,
  ValidationError,
} as const;

export function restorePayloadErrorNames(): void {
  for (const [name, cls] of Object.entries(NAMED)) {
    if (typeof cls === 'function' && cls.name !== name) {
      try {
        Object.defineProperty(cls, 'name', { value: name, configurable: true });
      } catch {
        /* frozen: keep the minified name */
      }
    }
  }
}

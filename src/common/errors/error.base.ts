export class BaseError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode = 500,
  ) {
    super(message);
  }
}

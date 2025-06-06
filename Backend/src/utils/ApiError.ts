class ApiError extends Error {
  statusCode: number;
  error?: any;
  stack?: string;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    error?: any,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}


export { ApiError };
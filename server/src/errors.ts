export class AiOutputRejectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiOutputRejectedError';
  }
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

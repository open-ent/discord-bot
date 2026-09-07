/* eslint-disable no-console */
function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.log(`[${timestamp()}] [info] ${message}`, ...args);
  },
  warn(message: string, ...args: unknown[]): void {
    console.warn(`[${timestamp()}] [warn] ${message}`, ...args);
  },
  error(message: string, ...args: unknown[]): void {
    console.error(`[${timestamp()}] [error] ${message}`, ...args);
  }
};

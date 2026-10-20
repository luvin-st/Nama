/** Outcome of a data call: either the data, or a message to show the user. */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };

export const ok = <T,>(data: T): Result<T> => ({ ok: true, data });
export const fail = <T,>(error: string): Result<T> => ({ ok: false, error });

export const NETWORK_ERROR = "We couldn't reach Nama' right now. Check your connection and try again.";

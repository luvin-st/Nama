/** Small readers for JSON returned by database functions (shape checked, never trusted). */
export type Obj = Record<string, unknown>;

export const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);
export const num = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0)) || 0;
export const str = (v: unknown): string => (typeof v === "string" ? v : "");
export const list = (v: unknown): Obj[] => (Array.isArray(v) ? v.filter(isObj) : []);

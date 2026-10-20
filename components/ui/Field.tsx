import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const ROW = "flex min-h-12 items-center gap-3 px-4";
const LABEL = "w-[92px] shrink-0 text-[17px]";
const INPUT = "min-w-0 flex-1 bg-transparent py-3 text-[17px] text-ink outline-none placeholder:text-muted";

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; id: string };

/** A labelled text input that sits inside a ListGroup. */
export function TextField({ label, id, ...rest }: InputProps) {
  return (
    <div className={ROW}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <input id={id} name={id} className={INPUT} {...rest} />
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; id: string; children: ReactNode };

export function SelectField({ label, id, children, ...rest }: SelectProps) {
  return (
    <div className={ROW}>
      <label htmlFor={id} className={LABEL}>
        {label}
      </label>
      <select id={id} name={id} className={`${INPUT} appearance-none`} {...rest}>
        {children}
      </select>
    </div>
  );
}

/** Error or confirmation message shown under a form. */
export function FormMessage({ error, message }: { error?: string; message?: string }) {
  if (error) {
    return (
      <p role="alert" className="-mt-1 px-4 text-[14px] text-danger">
        {error}
      </p>
    );
  }
  if (message) {
    return (
      <p role="status" className="rounded-[14px] bg-card px-4 py-3 text-[15px]">
        {message}
      </p>
    );
  }
  return null;
}

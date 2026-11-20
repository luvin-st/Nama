"use client";

import { startTransition, useActionState, type FormEvent } from "react";

/**
 * Like useActionState for a <form>, but the typed values stay in the boxes after an error.
 * (A plain `<form action>` empties every field once the action answers.)
 */
export function useFormAction<S>(action: (prev: Awaited<S>, fd: FormData) => S | Promise<S>, initial: Awaited<S>) {
  const [state, run, pending] = useActionState<S, FormData>(action, initial);
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => run(fd));
  };
  return { state, onSubmit, pending };
}

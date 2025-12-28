"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import css from "./SignInPage.module.css";
import { login } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.push("/profile");
    },
    onError: () => {
      setError("Invalid email or password");
    },
  });

  const handleSubmit = (FormData:FormData) =>{
     
      const email = FormData.get("email") as string;
      const password = FormData.get("password") as string;
   

      mutate({email,password});
  };

  return (
    <main className={css.mainContent}>
      <form
        className={css.form}
        action={(formData) => handleSubmit(formData)}
      >
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            disabled={isPending}
            className={css.submitButton}
          >
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}

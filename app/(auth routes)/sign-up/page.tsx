"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./SignUpPage.module.css";

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (user) => {
      
      setUser(user);

  
      router.push("/profile");
    },
  });

  async function handleSignUp(formData: FormData) {
    const email = String(formData.get("email"));
    const password = String(formData.get("password"));

    await mutation.mutateAsync({ email, password });
  }

  return (
    <form className={css.form}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        required
      />

      <button
        formAction={handleSignUp}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Signing up..." : "Sign up"}
      </button>

      {mutation.isError && (
        <p className={css.error}>Registration failed</p>
      )}
    </form>
  );
}

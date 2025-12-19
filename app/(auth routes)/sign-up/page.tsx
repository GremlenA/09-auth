"use client"
import css from "./SignUpPage.module.css"
import { registration } from "@/lib/api/clientApi";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";

export default function Register() {
  const{mutate,isPending} = useMutation({
    mutationFn:registration,
    onSuccess:(data)=>{
      console.log(data);
    }
    
  })

     const handleSubmit = (FormData:FormData) =>{
      const avatar = FormData.get("avatar") as string;
      const email = FormData.get("email") as string;
      const password = FormData.get("password") as string;
      const username = FormData.get("username") as string

      mutate({username,email,password,avatar});
     }

    return(<main className={css.mainContent}>
  <h1 className={css.formTitle}>Sign up</h1>
	<form className={css.form}>
    <div className={css.formGroup}>
      <label htmlFor="email">Email</label>
      <input id="email" type="email" name="email" className={css.input} required />
    </div>

    <div className={css.formGroup}>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" name="password" className={css.input} required />
    </div>

    <div className={css.actions}>
      <button type="submit" disabled={isPending} className={css.submitButton}>
        Register
      </button>
    </div>

    <p className={css.error}>Error</p>
  </form>
</main>
);
}
"use client";

import Image from "next/image";
import css from "./EditProfilePage.module.css";
import { updateMe, UpdateMeRequest } from "@/lib/api/clientApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore";

function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [error, setError] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const handleSubmit = async (formData: FormData) => {
    try {
      const email = formData.get("email");
      const username = formData.get("username");

      if (typeof email !== "string" || typeof username !== "string") {
        throw new Error("Invalid form data");
      }

      const formValues: UpdateMeRequest = {
        email,
        username,
      };

      const res = await updateMe(formValues);

      if (res) {
        setUser(res);
        router.push("/profile");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError((error as Error).message ?? "Oops... some error");
    }
  };

  const handleCancel = () => {
    router.back();
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar || "Avatar"}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              id="username"
              defaultValue={user?.username}
              type="text"
              className={css.input}
            />
          </div>

          <div className={css.usernameWrapper}>
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              value={user?.email}
              readOnly
              className={css.inputReadonly}
            />
          </div>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>

          {error && <p className={css.error}>{error}</p>}
        </form>
      </div>
    </main>
  );
}

export default EditProfilePage;

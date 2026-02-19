// import { Field, Form, Formik, ErrorMessage, type FormikHelpers } from "formik";
import css from "./NoteForm.module.css";
// import { useId } from "react";
// import * as Yup from "yup";
import type { NoteTag } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api/clientApi";
import { useNoteDraftStore } from "@/lib/store/noteStore";
import { useRouter } from "next/navigation";

// const NoteFormSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Title must be at least 3 characters")
//     .max(50, "Title must be at most 50 characters")
//     .required("Title is required"),
//   content: Yup.string().max(500, "Content must be at most 500 characters"),
//   tag: Yup.string()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
//     .required("Tag is required"),
// });

interface NoteFormProps {
  onClose: () => void;
}

export interface CreateNoteRequest {
  title: string;
  content: string;
  tag: NoteTag;
}

function NoteForm({ onClose }: NoteFormProps) {
  const router = useRouter();
  // const fieldId = useId();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  // const initialValues: CreateNoteRequest = {
  //   title: "",
  //   content: "",
  //   tag: "Todo",
  // };

  const createMutation = useMutation({
    mutationFn: (note: CreateNoteRequest) => createNote(note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const note = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      tag: formData.get("tag") as NoteTag,
    };

    createMutation.mutate(note);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <fieldset className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          className={css.input}
          defaultValue={draft?.title}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          defaultValue={draft?.content}
          onChange={handleChange}
        />
      </fieldset>

      <fieldset className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          defaultValue={draft?.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </fieldset>

      <fieldset className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </fieldset>
    </form>
  );
}

export default NoteForm;

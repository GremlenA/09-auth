"use client";

import Modal from "@/components/Modal/Modal";
import NotePreview from "@/components/NotePreview/NotePreview";

export default function ModalNotePage({
  params,
}: {
  params: { id: string };
}) {
  const handleClose = () => window.history.back();

  return (
    <Modal onClose={handleClose}>
      <NotePreview noteId={params.id} />
    </Modal>
  );
}

import { useState } from "react";
import ActionButton from "../components/ui/ActionButton.jsx";
import ModalShell from "../components/ui/ModalShell.jsx";

export default function InputModal({ open, title, label, placeholder, multiline = false, onClose, onSubmit }) {
  const [value, setValue] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
    onClose();
  }

  const Field = multiline ? "textarea" : "input";

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-medium text-space-muted">{label}</label>
        <Field
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          rows={multiline ? 5 : undefined}
          className="w-full rounded-3xl border border-white/10 bg-space-soft px-4 py-3 text-sm text-white outline-none placeholder:text-space-muted focus:border-space-pink"
        />
        <ActionButton className="w-full">Save for The One</ActionButton>
      </form>
    </ModalShell>
  );
}

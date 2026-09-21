import { useState } from "react";
import Modal from "./Modal.jsx";

// Asks before a destructive action, and stays open while the request is in
// flight so the record cannot be deleted twice by an impatient second click.
export default function ConfirmDialog({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
}) {
  const [working, setWorking] = useState(false);

  async function confirm() {
    setWorking(true);
    try {
      await onConfirm();
    } finally {
      setWorking(false);
    }
  }

  return (
    <Modal title={title} onClose={working ? () => {} : onCancel}>
      <p style={{ marginTop: 0 }}>{message}</p>
      <div className="modal-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={working}>
          Cancel
        </button>
        <button type="button" className="btn btn-danger" onClick={confirm} disabled={working}>
          {working ? "Deleting…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

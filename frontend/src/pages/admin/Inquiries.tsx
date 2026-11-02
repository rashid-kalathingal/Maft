import { useState } from "react";
import { Eye, Trash2, Filter } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import type { Inquiry, InquiryStatus, CartItem } from "@/types";

const STATUS_OPTIONS: InquiryStatus[] = ["PENDING", "RESPONDED", "COMPLETED", "CANCELLED"];

const STATUS_COLORS: Record<InquiryStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  RESPONDED: "bg-info/10 text-info",
  COMPLETED: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
};

export function Inquiries() {
  const { inquiries, saveInquiry, deleteInquiry } = useData();
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const [editing, setEditing] = useState<Inquiry | null>(null);
  const [toDelete, setToDelete] = useState<Inquiry | null>(null);
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | "ALL">("ALL");

  const filtered = statusFilter === "ALL"
    ? inquiries
    : inquiries.filter((i) => i.status === statusFilter);

  const sorted = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-primary tracking-tight">Inquiries</h1>
          <p className="mt-1 text-sm text-muted">{inquiries.length} total inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InquiryStatus | "ALL")}
            className="input w-auto min-w-[160px]"
          >
            <option value="ALL">All Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-12">
          <p className="text-muted">No inquiries found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {sorted.map((i) => (
                  <tr key={i.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-primary">{i.customerName}</div>
                      <div className="text-xs text-muted">{i.customerEmail}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-ink-soft">{i.customerPhone}</div>
                      {i.customerAddress && <div className="text-xs text-muted truncate max-w-48">{i.customerAddress}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[i.status]}`}>{i.status}</span>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {new Date(i.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewing(i)}
                          className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-accent transition-colors"
                          title="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setEditing(i)}
                          className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-accent transition-colors"
                          title="Update status"
                        >
                          <Filter className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setToDelete(i)}
                          className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewing && (
        <ViewInquiryModal
          inquiry={viewing}
          onClose={() => setViewing(null)}
          onEdit={() => { setViewing(null); setEditing(viewing); }}
        />
      )}

      {editing && (
        <EditInquiryModal
          inquiry={editing}
          onClose={() => setEditing(null)}
          onSave={(i) => { saveInquiry(i); toast.success("Inquiry updated."); setEditing(null); }}
        />
      )}

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Delete inquiry?"
        footer={
          <div className="flex justify-end gap-3">
            <button onClick={() => setToDelete(null)} className="btn-outline">Cancel</button>
            <button
              onClick={() => {
                if (!toDelete) return;
                deleteInquiry(toDelete.id);
                toast.success("Inquiry deleted.");
                setToDelete(null);
              }}
              className="btn-danger"
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-sm text-ink-soft">
          Delete inquiry from <b>{toDelete?.customerName}</b>? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}

function ViewInquiryModal({ inquiry, onClose, onEdit }: { inquiry: Inquiry; onClose: () => void; onEdit: () => void }) {
  const cartItems: CartItem[] = JSON.parse(inquiry.cartItems);

  return (
    <Modal
      open
      onClose={onClose}
      title="Inquiry Details"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Close</button>
          <button onClick={onEdit} className="btn-primary">Update Status</button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Customer Name</label>
            <p className="text-primary font-medium">{inquiry.customerName}</p>
          </div>
          <div>
            <label className="label">Email</label>
            <p className="text-ink-soft">{inquiry.customerEmail}</p>
          </div>
          <div>
            <label className="label">Phone</label>
            <p className="text-ink-soft">{inquiry.customerPhone}</p>
          </div>
          <div>
            <label className="label">Status</label>
            <span className={`badge ${STATUS_COLORS[inquiry.status]}`}>{inquiry.status}</span>
          </div>
        </div>
        {inquiry.customerAddress && (
          <div>
            <label className="label">Address</label>
            <p className="text-ink-soft">{inquiry.customerAddress}</p>
          </div>
        )}
        {inquiry.notes && (
          <div>
            <label className="label">Admin Notes</label>
            <p className="text-ink-soft bg-surface p-3 rounded-lg">{inquiry.notes}</p>
          </div>
        )}
        <div>
          <label className="label">Cart Items ({cartItems.length})</label>
          <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2">
                <div className="text-sm">
                  <span className="font-medium text-primary">Qty: {item.quantity}</span>
                  <span className="text-muted mx-2">·</span>
                  <span className="text-ink-soft">Variant: {item.variantId || "Default"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted">
          Created: {new Date(inquiry.createdAt).toLocaleString()}
          {inquiry.updatedAt !== inquiry.createdAt && (
            <span className="ml-3">Updated: {new Date(inquiry.updatedAt).toLocaleString()}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}

function EditInquiryModal({ inquiry, onClose, onSave }: { inquiry: Inquiry; onClose: () => void; onSave: (i: Inquiry) => void }) {
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [notes, setNotes] = useState(inquiry.notes ?? "");

  const save = () => {
    onSave({
      ...inquiry,
      status,
      notes: notes.trim() || undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Update Inquiry"
      footer={
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={save} className="btn-primary">Save</button>
        </div>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as InquiryStatus)}
            className="input"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Admin Notes</label>
          <textarea
            className="input min-h-24 resize-y"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this inquiry..."
          />
        </div>
      </div>
    </Modal>
  );
}

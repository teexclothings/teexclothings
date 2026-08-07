"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { TableSkeleton } from "@/components/ui/Skeletons";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/context/ToastContext";
import { Plus, Search, Trash2, Edit2, CheckCircle2, XCircle, Truck } from "lucide-react";

interface ShippingRule {
  id: string;
  state_name: string;
  shipping_charge: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function ShippingPage() {
  const [rules, setRules] = useState<ShippingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();
  const supabase = createClient();

  // Add/Edit Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formStateName, setFormStateName] = useState("");
  const [formCharge, setFormCharge] = useState("");
  const [formActive, setFormActive] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Delete Modal States
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRules = React.useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("shipping_charges")
      .select("*")
      .order("state_name", { ascending: true });

    if (error) {
      showToast(error.message, "error");
    } else {
      setRules(data || []);
    }
    setLoading(false);
  }, [supabase, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRules();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchRules]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setSelectedId(null);
    setFormStateName("");
    setFormCharge("");
    setFormActive(true);
    setModalOpen(true);
  };

  const handleOpenEdit = (rule: ShippingRule) => {
    setIsEditing(true);
    setSelectedId(rule.id);
    setFormStateName(rule.state_name);
    setFormCharge(rule.shipping_charge.toString());
    setFormActive(rule.is_active);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const chargeNum = parseFloat(formCharge);

    if (!formStateName || isNaN(chargeNum) || chargeNum < 0) {
      showToast("State name and a valid shipping cost (>= 0) are required.", "error");
      return;
    }

    setFormLoading(true);

    if (isEditing && selectedId) {
      const { error } = await supabase
        .from("shipping_charges")
        .update({
          state_name: formStateName.trim(),
          shipping_charge: chargeNum,
          is_active: formActive,
        })
        .eq("id", selectedId);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Shipping charge updated successfully.", "success");
        setModalOpen(false);
        fetchRules();
      }
    } else {
      // Unique state check
      const { data: check } = await supabase
        .from("shipping_charges")
        .select("id")
        .eq("state_name", formStateName.trim())
        .maybeSingle();

      if (check) {
        showToast("A shipping charge for this state already exists.", "error");
        setFormLoading(false);
        return;
      }

      const { error } = await supabase.from("shipping_charges").insert([
        {
          state_name: formStateName.trim(),
          shipping_charge: chargeNum,
          is_active: formActive,
        },
      ]);

      if (error) {
        showToast(error.message, "error");
      } else {
        showToast("Shipping rule created successfully.", "success");
        setModalOpen(false);
        fetchRules();
      }
    }

    setFormLoading(false);
  };

  const handleToggleActive = async (rule: ShippingRule) => {
    const { error } = await supabase
      .from("shipping_charges")
      .update({ is_active: !rule.is_active })
      .eq("id", rule.id);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast(
        `Shipping rule for ${rule.state_name} ${rule.is_active ? "disabled" : "enabled"} successfully.`,
        "success",
      );
      fetchRules();
    }
  };

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);

    const { error } = await supabase.from("shipping_charges").delete().eq("id", deleteId);

    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Shipping rule deleted successfully.", "success");
      setDeleteOpen(false);
      fetchRules();
    }

    setDeleteLoading(false);
  };

  const filtered = rules.filter(
    (r) => r.state_name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 dark:border-neutral-850 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-[10px] font-light tracking-[0.25em] text-neutral-500 uppercase">
            Logistic settings
          </span>
          <h1 className="font-serif-luxury text-3xl font-light tracking-wider uppercase mt-1">
            Shipping Charges
          </h1>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex cursor-pointer items-center justify-center space-x-2 bg-black dark:bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black dark:text-white dark:text-black transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-200 rounded-sm select-none"
        >
          <Plus size={14} />
          <span>Add State</span>
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative max-w-sm">
          <span className="absolute inset-y-0 left-3 flex items-center text-neutral-500">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="SEARCH STATES..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-10 py-2.5 text-xs tracking-wider uppercase text-black dark:text-white placeholder-neutral-600 focus:border-black dark:focus:border-neutral-500 focus:outline-none"
          />
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : filtered.length === 0 ? (
          <div className="rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-50 dark:bg-neutral-900/30 p-12 text-center">
            <Truck className="mx-auto text-neutral-700 mb-4" size={40} />
            <h3 className="text-xs font-semibold tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              No shipping rules found
            </h3>
            <p className="mt-1 text-xs font-light text-neutral-500">
              Create a new state-based rule to configure flat shipping delivery costs.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 tracking-widest uppercase">
                  <th className="px-6 py-4 font-light">State / Region Name</th>
                  <th className="px-6 py-4 font-light">Flat Rate Charge</th>
                  <th className="px-6 py-4 text-center font-light">Status</th>
                  <th className="px-6 py-4 text-right font-light">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {filtered.map((rule) => (
                  <tr key={rule.id} className="transition-colors hover:bg-neutral-100 dark:bg-neutral-800/20">
                    <td className="px-6 py-4 font-medium text-black dark:text-white">{rule.state_name}</td>
                    <td className="px-6 py-4 font-mono text-neutral-600 dark:text-neutral-400">
                      ${rule.shipping_charge.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggleActive(rule)}
                        className={`inline-flex items-center space-x-1.5 focus:outline-none cursor-pointer ${
                          rule.is_active ? "text-black dark:text-white" : "text-neutral-600"
                        }`}
                      >
                        {rule.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        <span className="text-[10px] font-semibold tracking-wider uppercase">
                          {rule.is_active ? "Active" : "Disabled"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => handleOpenEdit(rule)}
                        className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:text-white transition-colors focus:outline-none cursor-pointer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleOpenDelete(rule.id)}
                        className="text-neutral-500 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={isEditing ? "Edit Shipping Rule" : "Add Shipping Rule"}
        description={
          isEditing
            ? "Modify flat rate charges for this state."
            : "Create flat delivery charges mapped to a state."
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              State / Region Name
            </label>
            <input
              type="text"
              required
              disabled={isEditing} // Prevent state rename to maintain unique constraint keys easily
              value={formStateName}
              onChange={(e) => setFormStateName(e.target.value)}
              placeholder="e.g. New York"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none disabled:bg-neutral-50 dark:bg-neutral-900 disabled:text-neutral-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-light tracking-widest text-neutral-600 dark:text-neutral-400 uppercase">
              Shipping Cost ($)
            </label>
            <input
              type="number"
              required
              step="0.01"
              min="0"
              value={formCharge}
              onChange={(e) => setFormCharge(e.target.value)}
              placeholder="e.g. 15.00"
              className="mt-1 block w-full rounded-sm border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-950 px-3 py-2 text-sm text-black dark:text-white focus:border-black dark:focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              id="shipping-active"
              type="checkbox"
              checked={formActive}
              onChange={(e) => setFormActive(e.target.checked)}
              className="h-4 w-4 accent-black dark:accent-white cursor-pointer"
            />
            <label
              htmlFor="shipping-active"
              className="ml-2 text-xs font-light text-neutral-600 dark:text-neutral-400 cursor-pointer"
            >
              Region is active (visible during customer delivery form checkout)
            </label>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full cursor-pointer bg-white text-black py-2.5 text-xs font-semibold uppercase tracking-widest hover:bg-neutral-200 disabled:bg-neutral-600 disabled:text-neutral-700 dark:text-neutral-300 rounded-sm mt-4"
          >
            {formLoading ? "Saving..." : "Save Rule"}
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Shipping Rule"
        description="Are you sure you want to permanently delete this region flat rate? This action is irreversible."
        actionText="Delete"
        onAction={handleDelete}
        actionLoading={deleteLoading}
        danger
      />
    </div>
  );
}

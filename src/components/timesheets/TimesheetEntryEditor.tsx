"use client";

import { useEffect, useRef, useState } from "react";
import {
  Minus,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";

import type { TimesheetEntry } from "@/types/timesheet";
import Button from "@/components/ui/Button";

export type EntryForm = Omit<TimesheetEntry, "id">;

const projects = [
  { id: "project-1", name: "Homepage Development" },
  { id: "project-2", name: "Dashboard Development" },
  { id: "project-3", name: "Mobile Application" },
];

const workTypes = [
  "Development",
  "Testing",
  "Bug fixes",
  "Meeting",
  "Design",
];

const emptyForm: EntryForm = {
  date: "",
  projectId: "",
  projectName: "",
  workType: "",
  description: "",
  hours: 1,
};

function formatShortDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric" }
  );
}

type TimesheetEntryEditorProps = {
  days: string[];
  entries: TimesheetEntry[];
  onEntriesChange: (entries: TimesheetEntry[]) => void;
};

export default function TimesheetEntryEditor({
  days,
  entries,
  onEntriesChange,
}: TimesheetEntryEditorProps) {
  const [menuEntryId, setMenuEntryId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [form, setForm] = useState<EntryForm>(emptyForm);
  const [error, setError] = useState("");
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuEntryId(null);
        if (entryToDelete) setEntryToDelete(null);
        else closeModal();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [entryToDelete]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuEntryId(null);
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function openAddModal(date: string) {
    setEditingEntryId(null);
    setForm({ ...emptyForm, date });
    setError("");
    setIsModalOpen(true);
  }

  function openEditModal(entry: TimesheetEntry) {
    setEditingEntryId(entry.id);
    setForm({
      date: entry.date,
      projectId: entry.projectId,
      projectName: entry.projectName,
      workType: entry.workType,
      description: entry.description,
      hours: entry.hours,
    });
    setError("");
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingEntryId(null);
    setForm(emptyForm);
    setError("");
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (
      !form.projectId ||
      !form.projectName ||
      !form.workType ||
      !form.description.trim() ||
      !form.date
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.hours <= 0) {
      setError("Hours must be greater than 0.");
      return;
    }

    const normalizedForm = {
      ...form,
      description: form.description.trim(),
    };

    if (editingEntryId) {
      onEntriesChange(
        entries.map((entry) =>
          entry.id === editingEntryId
            ? { ...entry, ...normalizedForm }
            : entry
        )
      );
    } else {
      onEntriesChange([
        ...entries,
        { id: `entry-${Date.now()}`, ...normalizedForm },
      ]);
    }

    closeModal();
  }

  function handleDelete(entryId: string) {
    onEntriesChange(
      entries.filter((entry) => entry.id !== entryId)
    );
    setEntryToDelete(null);
  }

  function changeHours(amount: number) {
    setForm((current) => ({
      ...current,
      hours: Math.min(24, Math.max(1, current.hours + amount)),
    }));
  }

  function handleProjectChange(projectId: string) {
    const project = projects.find((item) => item.id === projectId);
    setForm((current) => ({
      ...current,
      projectId,
      projectName: project?.name ?? "",
    }));
  }

  return (
    <>
      <div className="space-y-6">
        {days.map((date) => {
          const dayEntries = entries.filter(
            (entry) => entry.date === date
          );

          return (
            <div
              key={date}
              className="grid grid-cols-[108px_1fr] gap-5"
            >
              <div className="text-[18px] font-semibold text-[#111928]">
                {formatShortDate(date)}
              </div>

              <div className="space-y-2.5">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex min-h-[44px] items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3"
                  >
                    <span className="min-w-0 flex-1 truncate text-[16px] font-medium text-[#111928]">
                      {entry.projectName}
                    </span>
                    <span className="shrink-0 text-[14px] text-[#9CA3AF]">
                      {entry.hours} hrs
                    </span>
                    <span className="hidden shrink-0 rounded-md bg-[#E1EFFE] px-2.5 py-0.5 text-[12px] font-medium text-[#1E429F] sm:inline-block">
                      {entry.projectName}
                    </span>
                    <div ref={menuEntryId === entry.id ? menuRef : undefined} className="relative">
                      <button
                        type="button"
                        onClick={() =>
                          setMenuEntryId(
                            menuEntryId === entry.id
                              ? null
                              : entry.id
                          )
                        }
                        className="flex items-center justify-center px-1 text-[#6B7280] hover:text-[#111928]"
                        aria-label="Entry actions"
                      >
                        <MoreHorizontal aria-hidden="true" className="size-4" />
                      </button>

                      {menuEntryId === entry.id && (
                        <div role="menu" className="absolute right-0 top-6 z-20 w-24 rounded-md border border-[#E5E7EB] bg-white py-1 shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setMenuEntryId(null);
                              openEditModal(entry);
                            }}
                            role="menuitem" className="block w-full px-3 py-1.5 text-left text-[12px] text-[#4A5565] hover:bg-[#F9FAFB]"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setMenuEntryId(null);
                              setEntryToDelete(entry.id);
                            }}
                            role="menuitem" className="block w-full px-3 py-1.5 text-left text-[12px] text-red-600 hover:bg-[#FEF2F2]"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => openAddModal(date)}
                  className="flex h-[44px] w-full items-center justify-center gap-1 rounded-lg border border-dashed border-[#D1D5DB] text-[16px] font-medium text-[#6B7280] transition-all hover:border-[#1A56DB] hover:bg-[#E1EFFE] hover:text-[#1A56DB]"
                >
                  <Plus aria-hidden="true" className="size-4" />
                  Add new task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#374151]/80 p-4" onMouseDown={closeModal}>
          <div role="dialog" aria-modal="true" aria-labelledby="entry-modal-title" className="w-full max-w-[646px] rounded-lg border border-[#E5E7EB] bg-white shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#E5E7EB] p-5">
              <h2 id="entry-modal-title" className="text-[18px] font-semibold text-[#111928]">
                {editingEntryId ? "Edit Entry" : "Add New Entry"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#9CA3AF] hover:text-[#111928]"
                aria-label="Close"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4 p-5">
                <label className="block text-[14px] font-medium text-[#111928]">
                  Select Project <span className="text-red-500">*</span>
                  <select
                    value={form.projectId}
                    onChange={(event) =>
                      handleProjectChange(event.target.value)
                    }
                    className="mt-2 h-[42px] w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-[14px] text-[#6B7280] outline-none focus:border-[#1C64F2]"
                    aria-invalid={!form.projectId && Boolean(error)}
                    required
                  >
                    <option value="">Project Name</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-[14px] font-medium text-[#111928]">
                  Type of Work <span className="text-red-500">*</span>
                  <select
                    value={form.workType}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        workType: event.target.value,
                      }))
                    }
                    className="mt-2 h-[42px] w-full rounded-lg border border-[#D1D5DB] bg-white px-3 text-[14px] text-[#6B7280] outline-none focus:border-[#1C64F2]"
                    aria-invalid={!form.workType && Boolean(error)}
                    required
                  >
                    <option value="">Bug fixes</option>
                    {workTypes.map((workType) => (
                      <option key={workType} value={workType}>
                        {workType}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-[14px] font-medium text-[#111928]">
                  Task description <span className="text-red-500">*</span>
                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Write text here ..."
                    rows={5}
                    className="mt-2 w-full resize-none rounded-lg border border-[#D1D5DB] px-4 py-3 text-[14px] text-[#111928] outline-none placeholder:text-[#9CA3AF] focus:border-[#1C64F2]"
                    aria-invalid={!form.description.trim() && Boolean(error)}
                    required
                  />
                  <span className="mt-2 block text-[12px] font-normal text-[#6B7280]">
                    A note for extra info
                  </span>
                </label>

                <div>
                  <label className="block text-[14px] font-medium text-[#111928]">
                    Hours <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-2 flex h-[37px] w-fit overflow-hidden rounded-lg border border-[#D1D5DB]">
                    <button
                      type="button"
                      onClick={() => changeHours(-1)}
                      className="w-[34px] border-r border-[#D1D5DB] bg-[#F3F4F6] text-[#111928] hover:bg-[#D1D5DB]"
                      aria-label="Decrease hours"
                    >
                      <Minus aria-hidden="true" className="mx-auto size-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={form.hours}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          hours: Math.min(
                            24,
                            Math.max(1, Number(event.target.value))
                          ),
                        }))
                      }
                      className="h-full w-[34px] appearance-none border-0 p-0 text-center text-[14px] text-[#6B7280] outline-none"
                      aria-label="Hours"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => changeHours(1)}
                      className="w-[34px] border-l border-[#D1D5DB] bg-[#F3F4F6] text-[#111928] hover:bg-[#D1D5DB]"
                      aria-label="Increase hours"
                    >
                      <Plus aria-hidden="true" className="mx-auto size-4" />
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="rounded-md bg-red-50 p-2 text-sm text-red-600">
                    {error}
                  </p>
                )}
              </div>

              <div className="flex gap-4 border-t border-[#E5E7EB] p-5">
                <Button
                  type="submit"
                  className="flex-1 rounded-lg py-2 text-[14px]"
                >
                  {editingEntryId ? "Update entry" : "Add entry"}
                </Button>
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="secondary"
                  className="flex-1 rounded-lg py-2 text-[14px]"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {entryToDelete && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-[#374151]/80 p-4" onMouseDown={() => setEntryToDelete(null)}>
          <div role="alertdialog" aria-modal="true" aria-labelledby="delete-entry-title" className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="delete-entry-title" className="text-lg font-semibold text-[#111928]">Delete entry?</h2>
            <p className="mt-2 text-sm text-[#6B7280]">This entry will be removed from the timesheet.</p>
            <div className="mt-5 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={() => setEntryToDelete(null)}>Cancel</Button><Button type="button" className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(entryToDelete)}>Delete</Button></div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";

type Task = {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string;
  estimatedTime: string;
  completed: boolean;
};

type AddTaskModalProps = {
  onClose: () => void;
  onAddTask: (task: Task) => void;
};

export default function AddTaskModal({
  onClose,
  onAddTask,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<
    "high" | "medium" | "low" | ""
  >("");
  const [deadline, setDeadline] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleSubmit = () => {
    if (!title.trim() || !priority || !deadline.trim()) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      priority,
      deadline: deadline.trim(),
      estimatedTime: estimatedTime.trim(),
      completed: false,
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Task
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        {/* Title */}
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter task title"
          className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500"
        />

        {/* Priority */}
        <label className="mb-3 block text-sm font-medium text-gray-700">
          Priority
        </label>

        <div className="mb-5 flex gap-3">
          <button
            type="button"
            onClick={() => setPriority("high")}
            className={`rounded-full border px-4 py-2 text-sm ${
              priority === "high"
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
          >
            🔴 High
          </button>

          <button
            type="button"
            onClick={() => setPriority("medium")}
            className={`rounded-full border px-4 py-2 text-sm ${
              priority === "medium"
                ? "border-yellow-500 bg-yellow-50"
                : "border-gray-300"
            }`}
          >
            🟡 Medium
          </button>

          <button
            type="button"
            onClick={() => setPriority("low")}
            className={`rounded-full border px-4 py-2 text-sm ${
              priority === "low"
                ? "border-green-500 bg-green-50"
                : "border-gray-300"
            }`}
          >
            🟢 Low
          </button>
        </div>

        {/* Deadline */}
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Deadline
        </label>

        <input
          type="text"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          placeholder="e.g. Friday 5 PM"
          className="mb-5 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500"
        />

        {/* Estimated time */}
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Estimated time (optional)
        </label>

        <input
          type="text"
          value={estimatedTime}
          onChange={(event) => setEstimatedTime(event.target.value)}
          placeholder="e.g. 2 hours"
          className="mb-6 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-gray-500"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={!title.trim() || !priority || !deadline.trim()}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}
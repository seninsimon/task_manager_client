"use client";

import { useState } from "react";
import api from "@/api/axios/axios.interceptor";
import TodoItem from "./TodoItem";

type Task = {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  assignee?: any;
  branchName?: string;
  progress?: string;
  todos?: { _id: string; text: string; done: boolean }[];
  createdAt?: string;
};

export default function TaskList({
  project,
  tasks,
  currentUser,
  onUpdated,
}: {
  project: any;
  tasks: Task[] | { tasks: Task[] };
  currentUser?: any;
  onUpdated?: () => void;
}) {
  const [addingTodoFor, setAddingTodoFor] = useState<string | null>(null);
  const [todoText, setTodoText] = useState("");
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  /** ------------------------------------------------
   * FIX: Always convert incoming tasks into an array
   * ------------------------------------------------ */
  const safeTasks: Task[] =
    Array.isArray(tasks)
      ? tasks
      : Array.isArray(tasks?.tasks)
      ? tasks.tasks
      : [];

  /* ------------------------------------------------
      Extract Logged-in User ID
  ------------------------------------------------ */
  const userId =
    currentUser?.userId ||
    currentUser?.data?.userId ||
    currentUser?._id ||
    currentUser?.id ||
    null;

  /* ------------------------------------------------
      Permission Logic
  ------------------------------------------------ */
  const canEditTask = (task: Task) => {
    if (!userId) return false;

    if (project.owner?._id === userId) return true;

    if (task.assignee) {
      const assigneeId = task.assignee._id || task.assignee;
      return assigneeId === userId;
    }

    return false;
  };

  /* ------------------------------------------------
      Add Todo
  ------------------------------------------------ */
  const addTodo = async (taskId: string) => {
    if (!todoText) return;
    setLoadingMap((m) => ({ ...m, [taskId]: true }));

    try {
      await api.post(`/tasks/${taskId}/todos`, { text: todoText });
      setTodoText("");
      setAddingTodoFor(null);
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMap((m) => ({ ...m, [taskId]: false }));
    }
  };

  /* ------------------------------------------------
      Toggle Todo
  ------------------------------------------------ */
  const toggleTodo = async (taskId: string, todoId: string, done: boolean) => {
    setLoadingMap((m) => ({ ...m, [todoId]: true }));

    try {
      await api.patch(`/tasks/${taskId}/todos/${todoId}`, { done: !done });
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMap((m) => ({ ...m, [todoId]: false }));
    }
  };

  /* ------------------------------------------------
      Update Task
  ------------------------------------------------ */
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setLoadingMap((m) => ({ ...m, [taskId]: true }));

    try {
      await api.patch(`/tasks/${taskId}`, updates);
      onUpdated?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMap((m) => ({ ...m, [taskId]: false }));
    }
  };

  /* ------------------------------------------------
      Create PR
  ------------------------------------------------ */
  const createPr = async (taskId: string) => {
    setLoadingMap((m) => ({ ...m, [taskId]: true }));

    try {
      await api.post(`/tasks/${taskId}/create-pr`);
      onUpdated?.();
      alert("PR created (placeholder).");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMap((m) => ({ ...m, [taskId]: false }));
    }
  };

  /* ------------------------------------------------
      UI Rendering
  ------------------------------------------------ */
  return (
    <div className="space-y-4">
      {safeTasks.length === 0 && (
        <div className="p-6 bg-white border border-[#D1D5DB] rounded-lg text-center">
          No tasks yet.
        </div>
      )}

      {safeTasks.map((task) => (
        <div
          key={task._id}
          className="bg-white border border-[#D1D5DB] rounded-lg p-4"
        >
          {/* Task Header */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-[#1F2937]">{task.title}</h4>
              {task.description && (
                <p className="text-sm text-gray-600">{task.description}</p>
              )}
              <div className="text-xs text-gray-400 mt-2">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString()
                  : "—"}
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="text-sm text-gray-500">
                {task.assignee
                  ? task.assignee.email || task.assignee
                  : "Unassigned"}
              </div>

              <div className="text-xs text-gray-500">
                {task.branchName || "—"}
              </div>

              <div className="text-xs text-gray-600">
                Status: <strong>{task.progress || "not_started"}</strong>
              </div>
            </div>
          </div>

          {/* Todos */}
          <div className="mt-3 space-y-2">
            {(task.todos || []).map((td) => (
              <TodoItem
                key={td._id}
                todo={td}
                onToggle={() => toggleTodo(task._id, td._id, td.done)}
                loading={!!loadingMap[td._id]}
              />
            ))}
          </div>

          {/* Add Todo */}
          {canEditTask(task) && (
            <div className="mt-3 flex gap-2 items-center">
              {addingTodoFor === task._id ? (
                <>
                  <input
                    value={todoText}
                    onChange={(e) => setTodoText(e.target.value)}
                    className="flex-1 border border-[#D1D5DB] rounded-lg p-2"
                    placeholder="New todo..."
                  />
                  <button
                    onClick={() => addTodo(task._id)}
                    disabled={loadingMap[task._id]}
                    className="px-3 py-1 bg-[#1F2937] text-white rounded-lg"
                  >
                    Add
                  </button>

                  <button
                    onClick={() => {
                      setAddingTodoFor(null);
                      setTodoText("");
                    }}
                    className="px-3 py-1 border rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setAddingTodoFor(task._id)}
                  className="px-3 py-1 border rounded-lg"
                >
                  + Add Todo
                </button>
              )}
            </div>
          )}

          {/* Branch, Progress, PR */}
          {canEditTask(task) && (
            <div className="mt-3 flex gap-2 items-center">
              <input
                placeholder="branch name"
                value={task.branchName || ""}
                onChange={(e) =>
                  updateTask(task._id, { branchName: e.target.value })
                }
                className="border border-[#D1D5DB] rounded-lg p-2"
              />

              <select
                value={task.progress || "not_started"}
                onChange={(e) =>
                  updateTask(task._id, { progress: e.target.value })
                }
                className="border border-[#D1D5DB] rounded-lg p-2"
              >
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="in_review">In review</option>
                <option value="done">Done</option>
              </select>

              <button
                disabled={task.progress !== "done"}
                onClick={() => createPr(task._id)}
                className={`px-3 py-1 rounded-lg ${
                  task.progress === "done"
                    ? "bg-[#1F2937] text-white"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Create PR
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

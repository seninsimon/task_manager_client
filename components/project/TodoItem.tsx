"use client";

export default function TodoItem({
  todo,
  onToggle,
  loading,
}: {
  todo: { _id: string; text: string; done: boolean };
  onToggle: () => void;
  loading?: boolean;
}) {
  return (
    <div
      className="
        flex items-center justify-between 
        gap-4 
        border border-[#D1D5DB] 
        rounded-lg 
        p-2 
        bg-white
      "
    >
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer"
          checked={todo.done}
          onChange={onToggle}
          disabled={loading}
        />

        {/* Todo Text */}
        <span
          className={`text-sm ${
            todo.done ? "line-through text-gray-400" : "text-[#1F2937]"
          }`}
        >
          {todo.text}
        </span>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <span className="text-xs text-gray-400 animate-pulse">Saving...</span>
      )}
    </div>
  );
}

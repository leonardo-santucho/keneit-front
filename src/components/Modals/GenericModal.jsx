import React from "react";
import { ExclamationTriangleIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";

export default function GenericModal({
  open,
  onClose,
  title = "Atención",
  message = "",
  icon = "warning", // "warning" | "question" | "none"
  buttons = [{ label: "OK", onClick: onClose }],
}) {
  if (!open) return null;

  const icons = {
    warning: <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />,
    question: <QuestionMarkCircleIcon className="h-8 w-8 text-blue-500" />,
    none: null,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div className="flex items-start gap-4">
          {icons[icon]}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 mt-2">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          {buttons.map((btn, i) => (
            <button
              key={i}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm"
              onClick={btn.onClick}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

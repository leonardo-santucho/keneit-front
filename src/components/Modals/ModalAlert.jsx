// components/ModalAlert.jsx
import React from "react";

export default function ModalAlert({ message, icon = null, buttons = ["OK"], onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex items-start gap-4">
          {icon === "warning" && (
            <div className="text-yellow-500 text-3xl">⚠️</div>
          )}
          {icon === "question" && (
            <div className="text-blue-500 text-3xl">❓</div>
          )}
          <div className="text-gray-800 text-sm">{message}</div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          {buttons.map((label, idx) => (
            <button
              key={idx}
              className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={onClose}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

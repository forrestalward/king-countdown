'use client';

import { X, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageName: string;
}

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, imageName }: DeleteConfirmationProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Delete Photo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-white/80 text-sm mb-3">
            Are you sure you want to delete this photo?
          </p>
          <div className="bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="text-white/60 text-xs font-mono break-all">
              {imageName}
            </p>
          </div>
          <p className="text-red-300 text-xs mt-3">
            ⚠️ This action cannot be undone
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500/80 hover:bg-red-500 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Photo
          </button>
        </div>
      </div>
    </div>
  );
}

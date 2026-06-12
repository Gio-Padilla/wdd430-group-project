"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    actionButton?: React.ReactNode;
};

export default function Modal({ isOpen, onClose, title, description, children, actionButton }: ModalProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen && !dialog.open) {
            dialog.showModal();
        } else if (!isOpen && dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <dialog
            ref={dialogRef}
            className="backdrop:bg-black/40 backdrop:backdrop-blur-sm bg-white rounded-2xl shadow-xl w-full max-w-md p-0 m-auto open:animate-in open:fade-in-90 open:zoom-in-95 border border-gray-200"
            onClose={onClose}
        >
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
                        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full p-2 transition-colors focus:outline-none"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="text-gray-700 py-2">
                    {children}
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                    >
                        Cancel
                    </button>
                    {actionButton}
                </div>
            </div>
        </dialog>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-lg border-l-4 p-4 min-w-80 max-w-96"
            style={{
              borderLeftColor: 
                toast.type === 'success' ? '#10B981' :
                toast.type === 'error' ? '#EF4444' :
                toast.type === 'warning' ? '#F59E0B' :
                '#3B82F6'
            }}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {toast.type === 'success' && <FiCheckCircle className="h-5 w-5 text-green-500" />}
                {toast.type === 'error' && <FiAlertCircle className="h-5 w-5 text-red-500" />}
                {toast.type === 'warning' && <FiAlertCircle className="h-5 w-5 text-yellow-500" />}
                {toast.type === 'info' && <FiAlertCircle className="h-5 w-5 text-blue-500" />}
              </div>
              
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">
                  {toast.title}
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  {toast.message}
                </p>
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition"
                title="Fechar notificação"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Hook para gerenciar toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Remove automaticamente após a duração especificada
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, message: string, duration?: number) => {
    addToast({ type: 'success', title, message, duration });
  };

  const error = (title: string, message: string, duration?: number) => {
    addToast({ type: 'error', title, message, duration });
  };

  const warning = (title: string, message: string, duration?: number) => {
    addToast({ type: 'warning', title, message, duration });
  };

  const info = (title: string, message: string, duration?: number) => {
    addToast({ type: 'info', title, message, duration });
  };

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
}

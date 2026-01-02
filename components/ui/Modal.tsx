'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  headerBg?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

/**
 * Modal Component
 * Reusable modal wrapper with consistent styling
 */
export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  headerBg = 'bg-primary text-primary-foreground',
  maxWidth = 'lg',
  showCloseButton = true,
  className,
}: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management & trap
  const contentRef = useRef<HTMLDivElement | null>(null);
  const previousActiveRef = useRef<HTMLElement | null>(null);
  const titleIdRef = useRef<string>(`modal-title-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus when modal closes
    previousActiveRef.current = document.activeElement as HTMLElement | null;

    // Focus first focusable element inside modal, or the content wrapper
    const selectors = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const root = contentRef.current;
    const focusable = root ? Array.from(root.querySelectorAll<HTMLElement>(selectors)) : [];
    if (focusable.length) {
      focusable[0].focus();
    } else if (root) {
      root.tabIndex = -1;
      root.focus();
    }

    // Trap tab focus inside the modal
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusableEls = root ? Array.from(root.querySelectorAll<HTMLElement>(selectors)) : [];
      if (focusableEls.length === 0) return;
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      // restore focus
      try {
        previousActiveRef.current?.focus();
      } catch (e) {
        /* ignore */
      }
    };
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div className="modal-overlay" onClick={onClose} aria-hidden={!isOpen}>
      <div
        ref={contentRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleIdRef.current : undefined}
        className={cn('modal-content', maxWidthClasses[maxWidth], className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || icon) && (
          <div className={cn('p-6', headerBg)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-2 bg-white/20 rounded-lg">
                    {icon}
                  </div>
                )}
                {title && (
                  <div>
                    <h2 id={titleIdRef.current} className="text-xl font-bold">{title}</h2>
                    {subtitle && (
                      <p className="opacity-80 text-sm">{subtitle}</p>
                    )}
                  </div>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </div>
    </div>
  );

  // Render modal into document body so it sits above other stacking contexts
  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}

interface ModalContentProps {
  children: ReactNode;
  className?: string;
}

export function ModalContent({ children, className }: ModalContentProps) {
  return <div className={cn('p-6', className)}>{children}</div>;
}

interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className }: ModalFooterProps) {
  return (
    <div className={cn('card-footer flex gap-3 justify-end', className)}>
      {children}
    </div>
  );
}

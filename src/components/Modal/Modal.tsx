import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface ModalProps {
    children: React.ReactNode;
    onClose: () => void;
}

const modalRoot = document.getElementById('modal-root') as HTMLElement;

export default function Modal({ children, onClose }: ModalProps) {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);

            document.body.style.overflow = previousOverflow;
        };
    }, [onClose]);

    const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return createPortal(
        <div
            className={css.backdrop}
            role="dialog"
            aria-modal="true"
            onClick={onBackdropClick}
        >
        <div className={css.modal}>{children}</div>
        </div>,
        modalRoot
    );
}


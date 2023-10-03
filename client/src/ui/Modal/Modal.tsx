import { useState, KeyboardEvent } from 'react';
import * as S from './Modal.style';

export interface ModalProps {
  children: React.ReactNode;
  canClose?: boolean;
  closeCallback?: () => void;
}

export default function Modal({
  children,
  canClose = true,
  closeCallback,
}: ModalProps) {
  const [visible, setVisible] = useState(true);

  const onEscapeKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setVisible(false);
      closeCallback && closeCallback();
    }
  };

  return (
    <S.Modal
      visible={visible}
      onKeyUp={canClose ? (e) => onEscapeKeyUp(e) : () => {}}>
      {children}
    </S.Modal>
  );
}

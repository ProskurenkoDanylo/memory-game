import Modal from '../../ui/Modal/Modal';
import * as S from './Suggestion.style';

interface SuggestionProps {
  acceptCallback: () => void;
  declineCallback: () => void;
  children: React.ReactNode;
}

export default function Suggestion({
  acceptCallback,
  declineCallback,
  children,
}: SuggestionProps) {
  return (
    <Modal closeCallback={declineCallback}>
      <S.Suggestion>{children}</S.Suggestion>
      <S.Agree>
        <S.AgreeButton onClick={acceptCallback}>Agree</S.AgreeButton>
        <S.Shadow />
      </S.Agree>
      <S.Disagree>
        <S.DisagreeButton onClick={declineCallback}>Disagree</S.DisagreeButton>
        <S.Shadow />
      </S.Disagree>
    </Modal>
  );
}

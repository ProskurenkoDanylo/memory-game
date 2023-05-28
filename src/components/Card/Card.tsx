import * as S from './Card.style';
import { Card as CardProps } from './Card.type';

function Card({ frontIconURL, back, border, opened, onClick }: CardProps) {
  return (
    <S.CardWrapper opened={opened} onClick={onClick} data-testid="card-wrapper">
      <S.Card
        borderWidth={border.borderWidth}
        borderStyle={border.borderStyle}
        borderColor={border.borderColor}
        borderImageURL={border.borderImageURL}>
        <S.CardFront>
          <img src={frontIconURL} alt="" />
        </S.CardFront>
        <S.CardBack>
          <img src={back} alt="" data-testid="card-back-img" />
        </S.CardBack>
      </S.Card>
    </S.CardWrapper>
  );
}

export default Card;

import TextProps from './Text.type';
import * as S from './Text.style';

function Text({
  className,
  children,
  alignment = 'left',
  color = '#fff',
  fontWeight = 'normal',
  style = {},
}: TextProps) {
  return (
    <S.Text
      className={className}
      alignment={alignment}
      color={color}
      fontWeight={fontWeight}
      style={style}>
      {children}
    </S.Text>
  );
}

export default Text;

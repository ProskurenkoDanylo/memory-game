import * as S from './Container.style';

export interface ContainerProps {
  children: React.ReactNode;
  flex?: boolean;
}

function Container({ children, flex = false }: ContainerProps) {
  return <S.Container flex={flex}>{children}</S.Container>;
}

export default Container;

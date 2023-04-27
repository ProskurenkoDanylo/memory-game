import * as S from './Container.style';

interface ContainerProps {
  children: React.ReactNode;
}

function Container({ children }: ContainerProps) {
  return <S.Container>{children}</S.Container>;
}

export default Container;

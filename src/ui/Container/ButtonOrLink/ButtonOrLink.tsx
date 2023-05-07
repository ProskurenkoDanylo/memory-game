import { ButtonOrLink as ButtonOrLinkProps } from './ButtonOrLink.type';
import { Button, Link } from './ButtonOrLink.styles';

function ButtonOrLink({
  children,
  $colors = '#0D66B1',
  $colorsDirection = -45,
  $textColor = '#FFF',
  $transitionTimeInMs = 400,
  link,
  onClick,
}: ButtonOrLinkProps) {
  if (link) {
    return (
      <Link
        to={link}
        $colors={$colors}
        $colorsDirection={$colorsDirection}
        $textColor={$textColor}
        $transitionTimeInMs={$transitionTimeInMs}>
        {children}
      </Link>
    );
  } else {
    return (
      <Button
        $colors={$colors}
        $colorsDirection={$colorsDirection}
        $textColor={$textColor}
        $transitionTimeInMs={$transitionTimeInMs}
        onClick={onClick}>
        {children}
      </Button>
    );
  }
}

export default ButtonOrLink;

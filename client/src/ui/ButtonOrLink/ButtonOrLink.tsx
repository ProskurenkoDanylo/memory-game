import { ButtonOrLink as ButtonOrLinkProps } from './ButtonOrLink.type';
import { Button, Link } from './ButtonOrLink.styles';

function ButtonOrLink({
  children,
  link,
  disabled,
  $colors = '#0D66B1',
  $colorsDirection = -45,
  $textColor = '#FFF',
  $transitionTimeInMs = 400,
  $startIcon,
  $endIcon,
  onClick,
  className,
}: ButtonOrLinkProps) {
  if (link) {
    return (
      <Link
        className={className}
        to={link}
        $colors={$colors}
        $colorsDirection={$colorsDirection}
        $textColor={$textColor}
        $transitionTimeInMs={$transitionTimeInMs}
        $startIcon={$startIcon}
        $endIcon={$endIcon}>
        {$startIcon}
        {children}
        {$endIcon}
      </Link>
    );
  } else {
    return (
      <Button
        className={className}
        $colors={$colors}
        $colorsDirection={$colorsDirection}
        $textColor={$textColor}
        $transitionTimeInMs={$transitionTimeInMs}
        onClick={onClick}
        disabled={disabled}>
        {$startIcon}
        {children}
        {$endIcon}
      </Button>
    );
  }
}

export default ButtonOrLink;

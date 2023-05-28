type Icon =
  | React.ReactElement<'img'>
  | React.ReactElement<'svg'>
  | React.ReactElement<'i'>;

export interface ButtonOrLink {
  children: React.ReactNode;
  $colors?: string | string[];
  $colorsDirection?: number;
  $textColor?: string;
  $transitionTimeInMs?: number;
  $startIcon?: Icon;
  $endIcon?: Icon;
  link?: string;
  disabled?: boolean;
  onClick?: () => void;
}

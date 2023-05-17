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
  link?: string;
  disabled?: boolean;
  startIcon?: Icon;
  endIcon?: Icon;
  onClick?: () => void;
}

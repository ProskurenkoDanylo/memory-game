export interface ButtonOrLink {
  children: React.ReactNode;
  $colors?: string | string[];
  $colorsDirection?: number;
  $textColor?: string;
  $transitionTimeInMs?: number;
  link?: string;
  disabled?: boolean;
  onClick?: () => void;
}

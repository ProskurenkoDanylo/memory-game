type Icon =
  | React.ReactElement<'img'>
  | React.ReactElement<'svg'>
  | React.ReactElement<'i'>;

export interface Input extends React.ComponentPropsWithoutRef<'input'> {
  label?: string;
  type?: 'text' | 'password' | 'email';
  isValid?: boolean | string;
  isRequired?: boolean;
  errorMessage?: string;
  style?: React.CSSProperties;
  startIcon?: Icon;
  endIcon?: Icon;
}

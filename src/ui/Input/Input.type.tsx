type Icon =
  | React.ReactElement<'img'>
  | React.ReactElement<'svg'>
  | React.ReactElement<'i'>;

export interface Input {
  value: string | number;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;

  id?: string;
  className?: string;
  type?: 'text' | 'password' | 'email';
  label?: string;
  placeholder?: string;
  isValid?: boolean | string;
  isRequired?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
  autoFocus?: boolean;
  startIcon?: Icon;
  endIcon?: Icon;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

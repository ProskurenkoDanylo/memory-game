export default interface Text {
  children: React.ReactNode;
  className?: string;
  alignment?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  fontWeight?: 'normal' | 'bold';
  style?: React.CSSProperties;
}

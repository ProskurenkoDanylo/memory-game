export interface Card {
  border: {
    borderWidth: string | number;
    borderStyle: string;
    borderColor: string;
    borderImageURL?: string;
  };
  frontIconURL: string;
  back: string;
  opened: boolean;
  onClick: () => void;
}

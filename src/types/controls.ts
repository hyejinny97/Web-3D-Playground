export type RangeControlType = {
  type: "range";
  label: string;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean;
  initValue?: number;
  onChange?: (value: number) => void;
};

export type CheckboxControlType = {
  type: "checkbox";
  label: string;
  initChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export type PlainTextControlType = {
  type: "plain-text";
  label: string;
  content: string;
};

export type ControlType =
  | RangeControlType
  | CheckboxControlType
  | PlainTextControlType;

import type { HEX } from "@jinni-labs/ui/types";

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

export type TextInputControlType = {
  type: "text-input";
  label: string;
  initValue?: string;
  onChange?: (value: string) => void;
};

export type SelectControlType = {
  type: "select";
  label: string;
  options: { label: string; value: string | number }[];
  initValue?: string | number;
  onChange?: (value: string | number) => void;
};

export type ColorControlType = {
  type: "color";
  label: string;
  initValue: HEX;
  onChange?: (value: HEX) => void;
};

export type ControlType =
  | RangeControlType
  | CheckboxControlType
  | PlainTextControlType
  | TextInputControlType
  | SelectControlType
  | ColorControlType;

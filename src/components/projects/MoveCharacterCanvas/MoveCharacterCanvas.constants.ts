export const CONTROL_KEYBOARD_KEYS = [
  {
    id: "shift",
    name: "Shift",
    className: "absolute left-0 bottom-0 w-15! text-sm!",
  },
  {
    id: " ",
    name: "Space",
    className: "absolute left-47 bottom-0 w-30! text-sm!",
  },
  { id: "a", name: "A", className: "absolute left-17 bottom-0 text-sm!" },
  { id: "s", name: "S", className: "absolute left-27 bottom-0 text-sm!" },
  { id: "d", name: "D", className: "absolute left-37 bottom-0 text-sm!" },
  { id: "w", name: "W", className: "absolute left-27 bottom-10 text-sm!" },
] as const;

export const TUTORIALS = [
  { label: "W / A / S / D", content: "Walk ↑ / ← / ↓ / →" },
  { label: "W / A / S / D + Shift", content: "Run ↑ / ← / ↓ / →" },
  { label: "Space", content: "Jump" },
];

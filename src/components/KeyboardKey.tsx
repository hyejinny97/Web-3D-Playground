import cn from "classnames";

interface KeyboardKeyProps {
  name: string;
  isPressed: boolean;
  className?: string;
}

const KeyboardKey = ({ name, isPressed, className }: KeyboardKeyProps) => {
  return (
    <div
      className={cn(
        `
        w-8 h-8 rounded-md font-medium text-xl flex items-center justify-center
        transition-all duration-75 select-none bg-stone-100 border border-stone-300 text-stone-700
        ${
          isPressed
            ? "translate-y-0.5 shadow-[0_2px_0_#999] bg-[repeating-linear-gradient(45deg,#aaa_0px,#aaa_1px,transparent_1px,transparent_5px)]"
            : "translate-y-0 shadow-[0_5px_0_#999,0_8px_10px_rgba(0,0,0,0.15)]"
        }
      `,
        className,
      )}
    >
      {name}
    </div>
  );
};

export default KeyboardKey;

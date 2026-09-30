import Stack from "@jinni-labs/ui/Stack";
import Text from "@jinni-labs/ui/Text";

const KeyboardTutorial = ({
  id,
  keyboardKey,
  description,
  isPressed,
}: {
  id: string;
  keyboardKey: string;
  description: string;
  isPressed: boolean;
}) => {
  return (
    <Stack className="items-center" id={id} direction="row" spacing={10}>
      <div
        className={`
        w-8 h-8 rounded-md font-medium text-xl flex items-center justify-center
        transition-all duration-75 select-none bg-stone-100 border border-stone-300 text-stone-700
        ${
          isPressed
            ? "translate-y-0.5 shadow-[0_2px_0_#999] bg-[repeating-linear-gradient(45deg,#aaa_0px,#aaa_1px,transparent_1px,transparent_5px)]"
            : "translate-y-0 shadow-[0_5px_0_#999,0_8px_10px_rgba(0,0,0,0.15)]"
        }
      `}
      >
        {keyboardKey}
      </div>
      <Text className="text-left text-white!">{description}</Text>
    </Stack>
  );
};

export default KeyboardTutorial;

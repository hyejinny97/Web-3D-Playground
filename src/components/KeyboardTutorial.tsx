import Stack from "@jinni-labs/ui/Stack";
import Text from "@jinni-labs/ui/Text";
import KeyboardKey from "./KeyboardKey";

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
      <KeyboardKey name={keyboardKey} isPressed={isPressed} />
      <Text className="text-left text-white!">{description}</Text>
    </Stack>
  );
};

export default KeyboardTutorial;

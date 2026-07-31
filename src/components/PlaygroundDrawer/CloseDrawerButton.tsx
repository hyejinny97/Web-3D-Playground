import type { ComponentProps } from "react";
import ButtonBase from "@jinni-labs/ui/ButtonBase";
import ArrowRightIcon from "@/components/icons/ArrowRightIcon";

const CloseDrawerButton = ({ onClick }: ComponentProps<"button">) => {
  return (
    <ButtonBase
      className="inline-flex justify-center items-center aspect-square rounded-full! p-1!"
      onClick={onClick}
    >
      <ArrowRightIcon className="fill-(--jinni-color-on-surface-variant)" />
    </ButtonBase>
  );
};

export default CloseDrawerButton;

import type { ComponentProps } from "react";
import cn from "classnames";
import ButtonBase from "@jinni-labs/ui/ButtonBase";
import BurgerIcon from "@/components/icons/BurgerIcon";

const OpenDrawerButton = ({ onClick }: ComponentProps<"button">) => {
  return (
    <ButtonBase
      className={cn(
        "absolute! right-2.5 top-2.5 inline-flex justify-center items-center aspect-square rounded-full! p-1!",
        { hidden: open },
      )}
      onClick={onClick}
    >
      <BurgerIcon className="fill-(--jinni-color-on-surface-variant)" />
    </ButtonBase>
  );
};

export default OpenDrawerButton;

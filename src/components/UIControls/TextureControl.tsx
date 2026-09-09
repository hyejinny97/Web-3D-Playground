import { useState } from "react";
import ControlGrid from "./ControlGrid";
import type { TextureControlType } from "@/types/controls";
import Switch from "@jinni-labs/ui/Switch";
import Text from "@jinni-labs/ui/Text";
import Box from "@jinni-labs/ui/Box";
import ButtonBase from "@jinni-labs/ui/ButtonBase";
import Backdrop from "@jinni-labs/ui/Backdrop";
import CancelIcon from "../icons/CancelIcon";

const TextureControl = ({
  label,
  imageUrl,
  initChecked,
  onChange,
}: TextureControlType) => {
  const [checked, setChecked] = useState<boolean>(initChecked ?? false);
  const [open, setOpen] = useState<boolean>(false);

  const openImageViewer = () => {
    setOpen(true);
  };
  const closeImageViewer = () => {
    setOpen(false);
  };

  return (
    <>
      <ControlGrid>
        <Text className="typo-label-medium wrap-break-word select-none">
          {label}
        </Text>
        <ButtonBase onClick={openImageViewer} aria-label="Open image viewer">
          <Box
            className="col-span-1 h-[32px] overflow-hidden"
            outlined
            round="xs"
          >
            <img
              className="w-full h-full object-cover"
              src={imageUrl}
              alt={label}
            />
          </Box>
        </ButtonBase>
        <Switch
          className="col-span-1 justify-self-center"
          checked={checked}
          onChange={(e) => {
            const { checked } = e.target;
            setChecked(checked);
            onChange?.(checked);
          }}
        />
      </ControlGrid>
      {open && (
        <Backdrop id="image viewer" className="z-[4000]!">
          <ButtonBase
            className="absolute! top-[10px] right-[10px]"
            onClick={closeImageViewer}
            aria-label="Close image viewer"
          >
            <CancelIcon className="fill-white" />
          </ButtonBase>
          <img
            className="w-full h-full object-contain"
            src={imageUrl}
            alt={label}
          />
        </Backdrop>
      )}
    </>
  );
};

export default TextureControl;

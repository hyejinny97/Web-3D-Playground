import { useState } from "react";
import ControlGrid from "./ControlGrid";
import type { ImageViewControlType } from "@/types/controls";
import Text from "@jinni-labs/ui/Text";
import Box from "@jinni-labs/ui/Box";
import ButtonBase from "@jinni-labs/ui/ButtonBase";
import Backdrop from "@jinni-labs/ui/Backdrop";
import CancelIcon from "../icons/CancelIcon";
import Image from "../Image";

const ImageViewControl = ({ label, imageUrl }: ImageViewControlType) => {
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
        <ButtonBase
          className="col-span-2 h-8"
          onClick={openImageViewer}
          aria-label="Open image viewer"
        >
          <Box className="w-full h-full overflow-hidden" outlined round="xs">
            <Image
              className="w-full h-full object-cover"
              url={imageUrl}
              alt={label}
            />
          </Box>
        </ButtonBase>
      </ControlGrid>
      {open && (
        <Backdrop
          id="image viewer"
          className="z-4000! flex align-center justify-center"
        >
          <ButtonBase
            className="absolute! top-3 right-3"
            onClick={closeImageViewer}
            aria-label="Close image viewer"
          >
            <CancelIcon className="fill-white w-10 h-10" />
          </ButtonBase>
          <Image
            className="max-w-[70vw] object-contain"
            url={imageUrl}
            alt={label}
          />
        </Backdrop>
      )}
    </>
  );
};

export default ImageViewControl;

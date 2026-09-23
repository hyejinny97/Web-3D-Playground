import cn from "classnames";
import Stack from "@jinni-labs/ui/Stack";
import Text from "@jinni-labs/ui/Text";
import LinearProgress from "@jinni-labs/ui/LinearProgress";
import {
  MAX_SPEED,
  TIRE_RADIUS,
} from "@/projects/GLTFModelProject/GLTFModelProject.constants";

const MAX = TIRE_RADIUS * MAX_SPEED;
const MIN = 0;

const CarSpeedProgress = ({
  className,
  speed,
}: {
  className?: string;
  speed: number; // 단위: m/s
}) => {
  return (
    <Stack className={cn("items-center w-15", className)} spacing={20}>
      <Text
        className="typo-label-small text-white! text-center"
        noMargin
      >{`${speed} m/s`}</Text>
      <LinearProgress
        className="h-75!"
        value={(speed / (MAX - MIN)) * 100}
        aria-label="car speed"
        orientation="vertical"
        thickness={10}
        lineCap="round"
        trackColor="#fff5"
        progressColor="blue-300"
      />
    </Stack>
  );
};

export default CarSpeedProgress;

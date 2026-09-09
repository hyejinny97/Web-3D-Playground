import cn from "classnames";
import CircularProgress from "@jinni-labs/ui/CircularProgress";
import Text from "@jinni-labs/ui/Text";

interface LoadingProps {
  progress: number;
  helpText?: string;
  className?: string;
}

const Loading = ({
  progress,
  helpText = "Loading...",
  className,
}: LoadingProps) => {
  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-full flex justify-center items-center",
        className,
      )}
    >
      <div className="relative">
        <CircularProgress
          size={60}
          value={progress}
          aria-label="파일 업로드 진행률"
        />
        <Text
          className="absolute bottom-[120%] left-[50%] transform-translate -translate-x-1/2 min-w-max typo-title-medium text-white!"
          noMargin
        >
          {helpText}
        </Text>
        <Text
          className="absolute top-[50%] left-[50%] transform-translate -translate-1/2 typo-label-medium text-white!"
          noMargin
        >{`${progress}%`}</Text>
      </div>
    </div>
  );
};

export default Loading;

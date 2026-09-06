import { CheckIcon } from "@phosphor-icons/react/dist/ssr";

export const ProgressCheckpoint = ({
  stepNumber,
  stepLabel,
  stepStatus = "pending",
}: {
  stepNumber: number;
  stepLabel: string;
  stepStatus?: "pending" | "ongoing" | "completed";
}) => {
  let circleStyles = "border-dashed border-accent-100 bg-base-100 border";
  let labelStyles = "text-muted";

  if (stepStatus === "completed") {
    circleStyles = "bg-accent-100 text-base-100";
    labelStyles = "text-accent-100";
  } else if (stepStatus === "ongoing") {
    circleStyles = "bg-accent-200 text-base-100";
    labelStyles = "text-accent-200";
  }

  return (
    <div className="w-11.75 flex flex-col items-center gap-2 shrink-0">
      <div
        className={`aspect-square w-full rounded-full flex justify-center items-center ${circleStyles}`}
      >
        {stepStatus === "completed" ? (
          <CheckIcon className="size-5 text-base-100" />
        ) : (
          stepNumber
        )}
      </div>
      <span className={`text-muted text-c-button ${labelStyles}`}>
        {stepLabel}
      </span>
    </div>
  );
};

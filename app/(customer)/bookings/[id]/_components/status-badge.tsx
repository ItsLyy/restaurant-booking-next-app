export const StatusBadge = ({
  status,
  variant = "neutral",
}: {
  status: string;
  variant?: "negative" | "neutral" | "positive";
}) => {
  let containerStyles = "bg-accent-200/20 text-accent-200";
  let cyrcleStyles = "bg-accent-200";

  if (variant === "positive") {
    containerStyles = "bg-positive/20 text-positive";
    cyrcleStyles = "bg-positive";
  } else if (variant === "negative") {
    containerStyles = "bg-negative/20 text-negative";
    cyrcleStyles = "bg-negative";
  }

  return (
    <div
      className={`flex gap-2 items-center justify-center py-2 px-3 rounded-lg ${containerStyles}`}
    >
      <div className={`rounded-full p-0.5 ${cyrcleStyles}`} />
      <span className="text-c-button leading-tight">{status}</span>
    </div>
  );
};

import { VARIANT_STYLES, type Variant } from "./variant-styles";

export const TableBadge = ({
  status,
  variant = "neutral",
}: {
  status: string;
  variant?: Variant;
}) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      className={`flex gap-2 items-center justify-center py-1 px-3 rounded-full size-fit font-dm-sans  border ${styles.container}`}
    >
      <div className={`rounded-full p-0.5 size-fit ${styles.dot}`} />
      <span className="leading-tight text-[10px]">{status}</span>
    </div>
  );
};

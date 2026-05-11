import Image from "next/image";
import { cn } from "@/lib/utils";

type OptionChipProps = {
  imageSrc?: string;
  label: string;
  selected: boolean;
  onClick: () => void;
};

export function OptionChip({ imageSrc, label, selected, onClick }: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        imageSrc ? "flex min-h-24 flex-col items-center justify-center gap-2 text-center" : "",
        selected ? "border-primary bg-primary text-primary-foreground" : "bg-white/70 hover:border-primary/50 hover:bg-muted",
      )}
    >
      {imageSrc ? (
        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-[#eee8d6]">
          <Image src={imageSrc} alt="" width={48} height={48} className="h-full w-full object-cover" />
        </span>
      ) : null}
      <span className={cn(imageSrc ? "text-xs font-medium leading-tight" : "")}>{label}</span>
    </button>
  );
}

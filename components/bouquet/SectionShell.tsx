import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SectionShellProps = {
  index: string;
  title: string;
  description: string;
  children: React.ReactNode;
};

export function SectionShell({ index, title, description, children }: SectionShellProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            {index}
          </span>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

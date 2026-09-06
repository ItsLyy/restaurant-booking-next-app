import { Badge } from "./badge";

export const Time = () => {
  return (
    <div className="flex flex-col gap-4 px-6 py-4 border-b border-muted">
      <span className="font-playfair-display font-medium text-base text-foreground">
        Choose Your Time
      </span>
      <div className="grid grid-cols-5 gap-2 h-13">
        <Badge>12:00</Badge>
        <Badge>12:30</Badge>
        <Badge>13:00</Badge>
        <Badge>13:30</Badge>
        <Badge>14:00</Badge>
      </div>
    </div>
  );
};

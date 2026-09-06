import { Badge } from "./badge";

export const PartySize = () => {
  return (
    <div className="flex flex-col gap-4 px-6 py-4">
      <span className="font-playfair-display font-medium text-base text-foreground">
        Number of People
      </span>
      <div className="grid grid-cols-6 gap-2 h-13">
        <Badge>1</Badge>
        <Badge>2</Badge>
        <Badge>3</Badge>
        <Badge>4</Badge>
        <Badge>5</Badge>
        <Badge>6</Badge>
      </div>
    </div>
  );
};

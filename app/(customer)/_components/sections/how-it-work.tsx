import { Button } from "@components/ui/button";

export const HowItWorkSection = () => {
  return (
    <section className="w-full p-6 pb-12 bg-base-200 rounded-lg space-y-4 shadow-sm shadow-black/5">
      <h2 className="text-c-header-md text-foreground">How It Works</h2>
      <div className="flex gap-6">
        <Steps
          number={1}
          title="Start with your account"
          content="Join in seconds — sign up with your email"
          actionLabel="Signup"
          actionLinkTo="/signup"
        />
        <div className="py-4">
          <hr className="w-11 text-muted" />
        </div>
        <Steps
          number={2}
          title="Find your perfect table"
          content="Explore restaurants near you, check real-time availability, and reserve your spot instantly."
          actionLabel="Explore Restaurants"
          actionLinkTo="/restaurants"
        />
        <div className="py-4">
          <hr className="w-11 text-muted" />
        </div>
        <Steps
          number={3}
          title="Just arrive and enjoy"
          content="Your table is ready. No waiting, no hassle — just a great meal ahead."
          actionLabel="View my Booking"
        />
      </div>
    </section>
  );
};

const Steps = ({
  number,
  title,
  content,
  actionLabel,
  actionLinkTo = "/",
}: {
  number: number;
  title: string;
  content: string;
  actionLabel?: string;
  actionLinkTo?: string;
}) => (
  <div className="flex gap-4 flex-1">
    <span className="flex justify-center items-center size-7.5 shrink-0 bg-muted/20 text-foreground rounded-lg">
      {number}
    </span>
    <div className="flex flex-col gap-3 w-fill">
      <span className="text-foreground text-c-body py-0.5">{title}</span>
      <p className="text-c-button text-muted">{content}</p>
      {actionLabel && (
        <Button
          as="link"
          href={actionLinkTo}
          className="w-fit! h-7.5 text-c-caption! px-5! py-0!"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  </div>
);

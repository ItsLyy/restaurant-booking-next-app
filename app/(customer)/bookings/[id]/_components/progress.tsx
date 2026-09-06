import { Card } from "./card";
import { ProgressCheckpoint } from "./progress-checkpoint";

import type { IBooking, IPayment } from "@types";

interface ProgressProps {
  bookingStatus: IBooking["status"];
  paymentStatus: IPayment["status"];
}

type StepStatus = "pending" | "ongoing" | "completed";

const stepTwoCondition = {
  pending: "ongoing",
  confirmed: "completed",
  completed: "completed",
};

const stepThreeCondition = {
  pending: "pending",
  confirmed: {
    paid: "completed",
    unpaid: "ongoing",
    failed: "ongoing",
    unrefunded: "pending",
  },
  completed: "completed",
};

const stepFourCondition = {
  pending: "pending",
  confirmed: {
    paid: "ongoing",
    unpaid: "pending",
    failed: "pending",
    unrefunded: "pending",
  },
  completed: "completed",
};

export const Progress = ({ bookingStatus, paymentStatus }: ProgressProps) => {
  if (
    bookingStatus === "cancelled" ||
    bookingStatus === "no_show" ||
    paymentStatus === "refunded"
  )
    return null;

  const stepTwoStatus = stepTwoCondition[bookingStatus] as StepStatus;
  const stepThreeStatus =
    bookingStatus === "confirmed"
      ? (stepThreeCondition[bookingStatus][paymentStatus] as StepStatus)
      : (stepThreeCondition[bookingStatus] as StepStatus);
  const stepFourStatus =
    bookingStatus === "confirmed"
      ? (stepFourCondition[bookingStatus][paymentStatus] as StepStatus)
      : (stepFourCondition[bookingStatus] as StepStatus);

  return (
    <Card className="space-y-6">
      <h2 className="text-c-button text-muted">PROGRESS</h2>
      <div className="flex gap-4">
        <ProgressCheckpoint
          stepLabel="Booked"
          stepNumber={1}
          stepStatus="completed"
        />
        <Line stepStatus="completed" />
        <ProgressCheckpoint
          stepLabel="Confirming"
          stepNumber={2}
          stepStatus={stepTwoStatus}
        />
        <Line stepStatus={stepThreeStatus} />
        <ProgressCheckpoint
          stepLabel="Payment"
          stepNumber={3}
          stepStatus={stepThreeStatus}
        />
        <Line stepStatus={stepFourStatus} />
        <ProgressCheckpoint
          stepLabel="Enjoy"
          stepNumber={4}
          stepStatus={stepFourStatus}
        />
      </div>
    </Card>
  );
};

const Line = ({
  stepStatus = "pending",
}: {
  stepStatus?: "pending" | "ongoing" | "completed";
}) => (
  <div className="flex items-center w-full h-11.75">
    <hr
      className={`w-full font-black ${stepStatus === "completed" ? "text-accent-100" : stepStatus === "ongoing" ? "text-accent-200/60" : "text-muted/40"}`}
    />
  </div>
);

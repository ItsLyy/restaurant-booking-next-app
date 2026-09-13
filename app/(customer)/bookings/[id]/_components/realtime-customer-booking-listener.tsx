"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BroadcastIcon } from "@phosphor-icons/react/dist/ssr";

import { getSupabaseBrowserClient } from "@libs/supabase/client";
import type { BookingBroadcastEventType, BookingBroadcastPayload } from "@db/broadcast";

interface RealtimeCustomerBookingListenerProps {
  bookingId: string;
  restaurantName?: string;
}

export const RealtimeCustomerBookingListener = ({
  bookingId,
  restaurantName,
}: RealtimeCustomerBookingListenerProps) => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const lastEventRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channelName = `booking:${bookingId}`;
    const channel = supabase.channel(channelName);

    const handleBookingUpdate = (payload: BookingBroadcastPayload & { event?: BookingBroadcastEventType }) => {
      const eventKey = `${payload.event || "update"}_${payload.status || ""}_${payload.paymentStatus || ""}_${Date.now()}`;
      // Debounce duplicate events within 500ms
      if (lastEventRef.current && Date.now() - Number(lastEventRef.current.split("_")[3] || 0) < 500) {
        return;
      }
      lastEventRef.current = eventKey;

      if (payload.event === "booking:confirmed") {
        toast.success("Your booking has been confirmed! You can now proceed to payment.");
      } else if (payload.event === "booking:rejected") {
        toast.error("Your booking was declined by the restaurant.");
      } else if (payload.event === "booking:cancelled") {
        toast.info("This booking has been cancelled.");
      } else if (payload.event === "booking:paid") {
        toast.success("Payment confirmed! Your reservation is secured.");
      } else if (payload.event === "booking:completed") {
        toast.success("Booking completed. Enjoy your meal!");
      }

      router.refresh();
    };

    channel
      .on("broadcast", { event: "*" }, ({ event, payload }) => {
        handleBookingUpdate({ ...(payload as BookingBroadcastPayload), event: event as BookingBroadcastEventType });
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `id=eq.${bookingId}`,
        },
        () => {
          router.refresh();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "payments",
          filter: `booking_id=eq.${bookingId}`,
        },
        () => {
          router.refresh();
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
        } else if (status === "CLOSED" || status === "CHANNEL_ERROR") {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, restaurantName, router]);

  return (
    <div
      className="flex items-center gap-1.5 text-c-caption text-muted py-1 select-none"
      title={isConnected ? "Real-time updates active via Supabase" : "Connecting real-time…"}
    >
      <span
        className={`size-2 rounded-full transition-colors ${
          isConnected ? "bg-positive animate-pulse" : "bg-muted"
        }`}
      />
      <span className="flex items-center gap-1">
        <BroadcastIcon className="size-3.5" />
        <span>{isConnected ? "Live tracking" : "Connecting…"}</span>
      </span>
    </div>
  );
};

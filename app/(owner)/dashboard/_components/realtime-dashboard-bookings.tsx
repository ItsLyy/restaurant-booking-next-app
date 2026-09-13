"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BroadcastIcon } from "@phosphor-icons/react/dist/ssr";

import { getSupabaseBrowserClient } from "@libs/supabase/client";
import type { BookingBroadcastEventType, BookingBroadcastPayload } from "@db/broadcast";

interface RealtimeDashboardBookingsProps {
  restaurantId?: string;
  showLiveBadge?: boolean;
}

export const RealtimeDashboardBookings = ({
  restaurantId = "rest-001",
  showLiveBadge = true,
}: RealtimeDashboardBookingsProps) => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const lastEventRef = useRef<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const channelName = `restaurant-bookings:${restaurantId}`;
    const channel = supabase.channel(channelName);

    const handleUpdate = (payload: BookingBroadcastPayload & { event?: BookingBroadcastEventType }) => {
      const eventKey = `${payload.event || "update"}_${payload.bookingId || ""}_${Date.now()}`;
      if (lastEventRef.current && Date.now() - Number(lastEventRef.current.split("_")[2] || 0) < 500) {
        return;
      }
      lastEventRef.current = eventKey;

      if (payload.event === "booking:created") {
        toast.info(`New Booking: ${payload.guestName || "Guest"}`, {
          description: `${payload.date || "Today"} at ${payload.time || ""} · Party of ${payload.partySize || 1}`,
        });
      } else if (payload.event === "booking:paid") {
        toast.success(`Booking payment received (#${payload.bookingId.slice(-4).toUpperCase()})`);
      } else if (payload.event === "booking:cancelled") {
        toast.warning(`Booking #${payload.bookingId.slice(-4).toUpperCase()} was cancelled.`);
      }

      router.refresh();
    };

    channel
      .on("broadcast", { event: "*" }, ({ event, payload }) => {
        handleUpdate({ ...(payload as BookingBroadcastPayload), event: event as BookingBroadcastEventType });
      })
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
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
  }, [restaurantId, router]);

  if (!showLiveBadge) return null;

  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-muted bg-base-100 text-c-caption font-medium select-none text-muted"
      title={isConnected ? "Real-time updates active via Supabase Realtime" : "Connecting to real-time…"}
    >
      <span
        className={`size-2 rounded-full transition-colors ${
          isConnected ? "bg-positive animate-pulse" : "bg-muted"
        }`}
      />
      <BroadcastIcon className="size-3.5" />
      <span className={isConnected ? "text-foreground" : "text-muted"}>
        {isConnected ? "Realtime Live" : "Connecting…"}
      </span>
    </div>
  );
};

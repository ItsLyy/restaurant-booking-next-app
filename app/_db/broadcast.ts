import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type BookingBroadcastEventType =
  | "booking:created"
  | "booking:confirmed"
  | "booking:rejected"
  | "booking:cancelled"
  | "booking:completed"
  | "booking:paid"
  | "booking:updated";

export interface BookingBroadcastPayload {
  bookingId: string;
  restaurantId: string;
  customerId?: string;
  tableId?: string;
  tableName?: string;
  guestName?: string;
  status?: string;
  date?: string;
  time?: string;
  partySize?: number;
  paymentStatus?: string;
  price?: number | null;
  cancelledBy?: "user" | "restaurant";
  cancelledReason?: string;
  updatedAt?: string;
}

let serverClient: SupabaseClient | null = null;

export function getSupabaseServerClient(): SupabaseClient | null {
  if (serverClient) return serverClient;

  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("[Broadcast] Supabase credentials not found in environment.");
    return null;
  }

  serverClient = createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });

  return serverClient;
}


/**
 * Broadcast a real-time booking event to both the restaurant channel
 * (for dashboard booking list and overview) and the booking channel
 * (for customer booking detail and specific booking views).
 */
export async function broadcastBookingEvent(
  event: BookingBroadcastEventType,
  payload: BookingBroadcastPayload,
): Promise<boolean> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return false;

  const restaurantChannelName = `restaurant-bookings:${payload.restaurantId}`;
  const bookingChannelName = `booking:${payload.bookingId}`;

  const sendOnChannel = (channelName: string): Promise<boolean> => {
    return new Promise<boolean>((resolve) => {
      const channel = supabase.channel(channelName);
      channel.subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel
            .send({
              type: "broadcast",
              event,
              payload: {
                ...payload,
                event,
                broadcastedAt: new Date().toISOString(),
              },
            })
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => {
              supabase.removeChannel(channel);
            });
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          supabase.removeChannel(channel);
          resolve(false);
        }
      });
    });
  };

  // Safe timeout to never block server action completion
  const timeout = new Promise<boolean>((resolve) =>
    setTimeout(() => resolve(false), 2000),
  );

  try {
    const results = await Promise.race([
      Promise.all([
        sendOnChannel(restaurantChannelName),
        sendOnChannel(bookingChannelName),
      ]),
      timeout,
    ]);
    return Array.isArray(results) ? results.every(Boolean) : results;
  } catch (err) {
    console.error("[Broadcast] Failed to send broadcast:", err);
    return false;
  }
}

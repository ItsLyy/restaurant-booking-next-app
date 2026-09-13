import tables from "@data/dummy/tables.json";

export interface BookableTable {
  id: string;
  name: string;
  capacity: number;
}

export const getAddBookingOptions = (): { tables: BookableTable[] } => {
  const options = tables.flatMap((table) =>
    table.restaurantId === "rest-001"
      ? [{ id: table.id, name: table.name, capacity: table.capacity }]
      : [],
  );
  return { tables: options };
};
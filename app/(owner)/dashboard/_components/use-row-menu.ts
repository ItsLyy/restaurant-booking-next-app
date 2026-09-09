"use client";

import { useState } from "react";

interface MenuAnchor {
  top: number;
  right: number;
}

const MENU_WIDTH = 176;
const EDGE_PADDING = 8;

/**
 * Positions and toggles the row action menus that render in a fixed portal
 * over the bookings tables. Shared by the dashboard overview and the detailed
 * bookings page so the portal/anchoring/flip-up logic stays in one place.
 */
export const useRowMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<MenuAnchor | null>(null);

  const toggleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    itemCount: number,
  ) => {
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 0;
    const viewportHeight =
      typeof window !== "undefined" ? window.innerHeight : 0;
    const desiredRight = viewportWidth - rect.right;
    // Clamp so the menu stays fully inside the viewport.
    const right = Math.min(
      Math.max(desiredRight, EDGE_PADDING),
      Math.max(viewportWidth - MENU_WIDTH - EDGE_PADDING, EDGE_PADDING),
    );
    const menuHeight = itemCount * 34 + 10;
    // Bottom rows: open upward when there is not enough room below.
    const openUp =
      rect.bottom + menuHeight + 12 > viewportHeight &&
      rect.top - menuHeight - 12 >= EDGE_PADDING;
    const top = openUp ? rect.top - menuHeight - 6 : rect.bottom + 6;
    setAnchor({ top, right });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, anchor, toggleMenu, closeMenu: close };
};
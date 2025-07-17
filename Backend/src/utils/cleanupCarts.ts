import { prisma } from "../db/index";

export async function cleanupOrphanedGuestCarts() {
  try {
    // Delete guest carts that are older than 30 days and have no items
    const result = await prisma.cart.deleteMany({
      where: {
        AND: [
          { user_id: null }, // Only guest carts
          { guestId: { not: null } }, // Has guestId
          { createdAt: { lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }, // Older than 30 days
          { items: { none: {} } } // No items
        ]
      }
    });

    console.log(`Cleaned up ${result.count} orphaned guest carts`);
    return result.count;
  } catch (error) {
    console.error("Error cleaning up orphaned guest carts:", error);
    return 0;
  }
}

export async function cleanupEmptyGuestCarts() {
  try {
    // Delete guest carts that have no items (regardless of age)
    const result = await prisma.cart.deleteMany({
      where: {
        AND: [
          { user_id: null }, // Only guest carts
          { guestId: { not: null } }, // Has guestId
          { items: { none: {} } } // No items
        ]
      }
    });

    console.log(`Cleaned up ${result.count} empty guest carts`);
    return result.count;
  } catch (error) {
    console.error("Error cleaning up empty guest carts:", error);
    return 0;
  }
}

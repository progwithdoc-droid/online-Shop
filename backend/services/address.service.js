import { eq, and } from 'drizzle-orm';
import { db } from '../config/db.js';
import { addresses } from '../models/schema.js';

export const getAddresses = async (userId) => {
  return db.select().from(addresses).where(eq(addresses.userId, userId));
};

export const createAddress = async (userId, addressData) => {
  let newAddress;
  
  if (db.transaction) {
    newAddress = await db.transaction(async (tx) => {
      // If setting as default, unset others first
      if (addressData.isDefault) {
        await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
      }
      
      const [inserted] = await tx.insert(addresses).values({
        ...addressData,
        userId
      }).returning();
      
      return inserted;
    });
  } else {
    if (addressData.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
    }
    const [inserted] = await db.insert(addresses).values({
      ...addressData,
      userId
    }).returning();
    newAddress = inserted;
  }
  
  return newAddress;
};

export const updateAddress = async (addressId, userId, addressData) => {
  const [address] = await db.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
  if (!address) {
    throw new Error('Address not found');
  }

  let updatedAddress;

  if (db.transaction) {
    updatedAddress = await db.transaction(async (tx) => {
      if (addressData.isDefault) {
        await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
      }
      
      const [updated] = await tx.update(addresses)
        .set(addressData)
        .where(eq(addresses.id, addressId))
        .returning();
        
      return updated;
    });
  } else {
    if (addressData.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
    }
    const [updated] = await db.update(addresses)
      .set(addressData)
      .where(eq(addresses.id, addressId))
      .returning();
    updatedAddress = updated;
  }

  return updatedAddress;
};

export const deleteAddress = async (addressId, userId) => {
  const [address] = await db.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
  if (!address) {
    throw new Error('Address not found');
  }

  await db.delete(addresses).where(eq(addresses.id, addressId));
  return { success: true };
};

export const setDefaultAddress = async (addressId, userId) => {
  const [address] = await db.select().from(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId))).limit(1);
  if (!address) {
    throw new Error('Address not found');
  }

  if (db.transaction) {
    await db.transaction(async (tx) => {
      await tx.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
      await tx.update(addresses).set({ isDefault: true }).where(eq(addresses.id, addressId));
    });
  } else {
    await db.update(addresses).set({ isDefault: false }).where(eq(addresses.userId, userId));
    await db.update(addresses).set({ isDefault: true }).where(eq(addresses.id, addressId));
  }

  return { success: true };
};

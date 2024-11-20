// src/PrismaSingleton.ts
import { PrismaClient } from "@prisma/client";

export class PrismaSingleton {
  private static instance: PrismaSingleton;
  prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  static getInstance(): PrismaSingleton {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton();
    }

    return PrismaSingleton.instance;
  }
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaSingleton = void 0;
// src/PrismaSingleton.ts
const client_1 = require("@prisma/client");
class PrismaSingleton {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    static getInstance() {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaSingleton();
        }
        return PrismaSingleton.instance;
    }
}
exports.PrismaSingleton = PrismaSingleton;

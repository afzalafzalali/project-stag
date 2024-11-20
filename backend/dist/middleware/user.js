"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../client");
const SECRET_KEY = process.env.JWT_SECRET;
// Middleware for user authentication
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    const prismaClient = client_1.PrismaSingleton.getInstance().prisma;
    if (!token) {
        res.status(401).json({
            success: false,
            message: "no token",
        });
        return;
    }
    try {
        const authToken = token.split(" ")[1];
        // Verify the JWT token
        const { email } = jsonwebtoken_1.default.verify(authToken, SECRET_KEY);
        // Fetch user from the database
        const user = yield prismaClient.user.findUnique({
            where: { email },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                message: "no user found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401).json({
            success: false,
            message: e.message,
        });
    }
});
exports.authenticateUser = authenticateUser;

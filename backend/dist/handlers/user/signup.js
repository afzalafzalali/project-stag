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
exports.userInput = void 0;
exports.signupUser = signupUser;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("../../client");
const helpers_1 = require("../../helpers");
const prismaClient = client_1.PrismaSingleton.getInstance().prisma;
exports.userInput = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: "Name should be provided" })
        .min(1, { message: "name should be provided" })
        .max(50, { message: "name too long" }),
    email: zod_1.z
        .string({ required_error: "Email should be provided" })
        .email({ message: "Invalid email syntax" }),
    password: zod_1.z
        .string({ required_error: "Password should be provided" })
        .min(1, { message: "Password should be provided" }),
});
// env var's
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);
const secret = process.env.JWT_SECRET;
function signupUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBody = req.body;
            const parsedInput = exports.userInput.safeParse(reqBody);
            if (!parsedInput.success) {
                res.status(401).json({
                    success: false,
                    message: "Invalid Input",
                    errors: parsedInput.error.format(),
                });
                return;
            }
            const { name, email, password } = parsedInput.data;
            // hashing password
            const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
            const hashedPassword = yield bcrypt_1.default.hash(password, salt);
            const userInDb = yield prismaClient.user.findUnique({ where: { email } });
            if (userInDb) {
                res.status(401).json({
                    success: false,
                    message: "user already present",
                    errors: {
                        email: "User present with the email",
                    },
                });
                return;
            }
            const user = yield prismaClient.user.create({
                data: {
                    name: name,
                    email,
                    passowrd: hashedPassword,
                },
            });
            const signedToken = yield (0, helpers_1.signAsync)({ email: user.email, secret });
            // deleting user password before sending as a response
            // @ts-ignore
            delete user.passowrd;
            res.status(200).json({
                success: true,
                message: "user created successfully",
                user,
                token: signedToken,
            });
        }
        catch (e) {
            res.status(401).json({
                success: false,
                message: e.message,
            });
        }
    });
}

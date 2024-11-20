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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
const client_1 = require("../../client");
const helpers_1 = require("../../helpers");
const signup_1 = require("./signup");
const prismaClient = client_1.PrismaSingleton.getInstance().prisma;
// env var's
const secret = process.env.JWT_SECRET;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const reqBody = req.body;
            const parsedInput = yield signup_1.userInput.safeParse(reqBody);
            if (!parsedInput.success) {
                res.status(401).json({
                    success: false,
                    message: "Invalid Input",
                });
                return;
            }
            const { email, password } = parsedInput.data;
            const userInDb = yield prismaClient.user.findUnique({ where: { email } });
            if (!userInDb) {
                res.status(401).json({
                    success: false,
                    message: "no user found with that email",
                });
                return;
            }
            const validPassword = yield (0, helpers_1.verifyPassword)(password, userInDb.passowrd);
            if (!validPassword) {
                res.status(401).json({
                    success: false,
                    message: "incorrect password",
                });
                return;
            }
            const signedToken = yield (0, helpers_1.signAsync)({ email: userInDb.email, secret });
            // deleting user password before sending as a response
            // @ts-ignore
            delete userInDb.passowrd;
            res.status(200).json({
                success: true,
                message: "login successfull",
                user: userInDb,
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

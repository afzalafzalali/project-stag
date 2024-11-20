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
exports.verifyPassword = exports.signAsync = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const signAsync = ({ email, secret, options }) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.sign({ email }, secret, { expiresIn: "24h" }, (err, token) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(token);
            }
        });
    });
};
exports.signAsync = signAsync;
//
// Function to verify a password
const verifyPassword = (inputPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordMatch = yield bcrypt_1.default.compare(inputPassword, hashedPassword);
        return passwordMatch;
    }
    catch (error) {
        return error;
    }
});
exports.verifyPassword = verifyPassword;

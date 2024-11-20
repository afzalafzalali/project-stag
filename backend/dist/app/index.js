"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = require("../routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)(), body_parser_1.default.json(), (0, cookie_parser_1.default)());
app.use("/api/user", routes_1.userRouter);
// healthCheck
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "server running fine",
    });
});
exports.default = app;

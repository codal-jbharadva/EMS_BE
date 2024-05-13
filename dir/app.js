"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("./routes/user.routes");
const event_routes_1 = require("./routes/event.routes");
const PORT = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', user_routes_1.userRouter);
app.use('/event', event_routes_1.eventRouter);
app.use('*', (req, res) => {
    res.status(200).json({
        message: "Hello"
    });
});
app.listen(PORT, () => {
    console.log("server is running on port ", PORT);
});

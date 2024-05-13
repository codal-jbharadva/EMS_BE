"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controller/user.controller");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get('/:id', user_controller_1.findUserByID);
exports.userRouter.post('/add', user_controller_1.addUser);
exports.userRouter.post('/update/:id', user_controller_1.updateUser);

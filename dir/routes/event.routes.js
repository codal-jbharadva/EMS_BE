"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRouter = void 0;
const express_1 = require("express");
exports.eventRouter = (0, express_1.Router)();
const event_controller_1 = require("../controller/event.controller");
exports.eventRouter.get('/', event_controller_1.getAllEvent);
exports.eventRouter.get('/:id', event_controller_1.getEventbyID);
exports.eventRouter.post('/add', event_controller_1.addEvent);
exports.eventRouter.post('/update/:id', event_controller_1.updateEvent);
exports.eventRouter.delete('/delete', event_controller_1.deleteEvent); // in this we are not actually deleting event but we are making it not visible

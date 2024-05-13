"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleResponse = void 0;
const handleResponse = (res, message, status, token, item, itemName = 'item') => {
    const responseObj = { message };
    if (token) {
        responseObj.Token = token;
    }
    else if (item !== undefined) {
        responseObj[itemName] = item;
    }
    return res.status(status).json(responseObj);
};
exports.handleResponse = handleResponse;

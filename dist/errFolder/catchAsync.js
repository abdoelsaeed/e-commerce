"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// تعريف نوع fn وهو دالة تأخذ Request وResponse وNextFunction كمعاملات وتُرجع Promise
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.default = catchAsync;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const orderController_1 = require("./../controller/orderController");
const router = express_1.default.Router();
router.use(authController_1.protect);
router.get('/getmyorder', orderController_1.getMyOrders);
router.route('/').post(orderController_1.createOrder).get(authController_1.authorization, orderController_1.getAllOrder);
router.get('/get-total-sales', orderController_1.getTotalSales);
router.route('/:id').get(orderController_1.getOrder).patch(orderController_1.updateOrder).delete(orderController_1.deleteOrder);
router.get('/get/count', orderController_1.getCountOrder);
exports.default = router;

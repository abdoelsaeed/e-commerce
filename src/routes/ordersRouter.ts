import express from 'express';
import { protect,authorization } from '../controller/authController';
import {getOrder,createOrder,updateOrder,deleteOrder,getAllOrder,getTotalSales,getCountOrder,getMyOrders} from './../controller/orderController'
const router = express.Router();
router.use(protect)
router.get('/getmyorder', getMyOrders);
router.route('/').post(createOrder).get(authorization,getAllOrder);
router.get('/get-total-sales', getTotalSales);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);
router.get('/get/count',getCountOrder);
export default router;
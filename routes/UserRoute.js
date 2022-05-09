import express from "express";
const router = express.Router();
import UserControllers from '../controllers/UserControllers.js';
import checkUserAuth from "../middlewares/auth-middleware.js";

//Route Level Middleware
router.use('./changepassword', checkUserAuth)

//Public Routes
router.post('/register', UserControllers.userRegistration)
router.post('/login', UserControllers.userLogin)


//Protected Routes
router.post('/changepassword', UserControllers.changeUserPassword)

export default router;
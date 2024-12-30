import express from "express";
import { addDoctor,allDoctors,loginAdmin,appoinmentsAdmin,appoinmentCancel,adminDashboard } from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";



const adminRouter = express.Router();

adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-Availability',authAdmin,changeAvailability)
adminRouter.get('/appointments',authAdmin,appoinmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appoinmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)



export default adminRouter
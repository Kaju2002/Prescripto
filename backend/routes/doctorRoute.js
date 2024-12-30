import express from "express";
import { doctorList,loginDoctor,appointmentsDoctor,appoinmentComplete,appoinmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile } from "../controllers/doctorController.js";
import authDoctor from "../middlewares/authDoctor.js";

const doctorRouter = express.Router();

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)
doctorRouter.post('/complete-appointment',authDoctor,appoinmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appoinmentCancel)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter
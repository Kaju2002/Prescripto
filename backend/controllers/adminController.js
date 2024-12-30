import validator from 'validator';
import bycript from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appoinmentModel.js';
import userModel from '../models/userModel.js';

//Api For Adding Doctor
const addDoctor =async  (req,res) =>{

    try {
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;
        const imageFile = req.file;

       
        //Check if all required fields are present
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        //validate email format
        if(!validator.isEmail(email)){
            return res.status(400).json({ message: 'please enter valid email' });
        }

        //validate password
        if(password.length < 8){
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        //hashing doctor password
        const salt = await bycript.genSalt(10);
        const hashedPassword = await bycript.hash(password,salt);

        //upload image to cloudenary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        const imageUrl = imageUpload.secure_url;


        const doctorData = {
            name,
            email,
            image:imageUrl,
            password:hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            date:Date.now()
        }

        const newDoctor = await doctorModel(doctorData);
        await newDoctor.save();

        

        // Send success response
        res.json({ success: true, message: "Doctor Added Successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

//api for the admin login
const loginAdmin = async (req,res) => {
    try {
        
        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token});

        }else{
            res.json({message:"Invalid Credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"})
    }
}

//Api for get All Doctors
const allDoctors = async (req,res) =>{


    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({success:true,doctors});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Something went wrong"})
        
    }
}

//API to get All appointments
const appoinmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        console.log("Appointments from DB:", appointments); // Log fetched data
        res.json({ success: true, appointments }); // Ensure you're sending "appointments" key
    } catch (error) {
        console.log("Error fetching appointments:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
};

//cancel the appoinment api
const appoinmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "Appointment ID is required" });
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        if (!doctorData) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Remove the booked slot
        doctorData.slot_booked[slotDate] = doctorData.slot_booked[slotDate].filter((e) => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slot_booked: doctorData.slot_booked });

        // Mark appointment as canceled
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        res.json({ success: true, message: "Appointment canceled successfully" });
    } catch (error) {
        console.error("Error in cancelAppoinment:", error);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
};


// API to get dashboard data fot ad PANEL
const adminDashboard = async (req, res) => {

    try {

        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appoinments = await appointmentModel.find({});

        const dashData ={
            doctors:doctors.length,
            appoinments:appoinments.length,
            patients:users.length,
            latestAppoinments:appoinments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData });
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}


export {addDoctor,loginAdmin,allDoctors,appoinmentsAdmin,appoinmentCancel,adminDashboard}
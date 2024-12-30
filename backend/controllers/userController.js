import validator from 'validator';
import bycrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appoinmentModel.js';

//api to register user
const registerUser = async (req,res) =>{
    
    try {
        

        const {name,email,password} = req.body

        //VALIDATE DATA
        if(!name || !email || !password){
            return res.status(400).json({success:false,message:"All fields are required"});
        }


        //VALIDATE EMAIL
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Please enter valid email"});
        }


        //VALIDATE PASSWORD
        if(password.length < 8){
            return res.status(400).json({success:false,message:"Password must be at least 8 characters long"});    
        }


        //HASHING PASSWORD
        const salt = await bycrypt.genSalt(10);
        const hashedPassword = await bycrypt.hash(password,salt);

        const userData ={
            name,
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();
        


        const token = jwt.sign({id:user._id},process.env.JWT_SECRET);

        res.json({success:true,token});



    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Something went wrong"});
        
    }
}


//API TO LOGIN USER
const loginUser = async (req,res) =>{

    try {

        const {email,password} = req.body;
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({success:false,message:"User does not exist"});
        }

        const isMatch = await bycrypt.compare(password,user.password);

        if(isMatch){
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET);
            res.json({success:true,token});
        }else{
            return res.status(400).json({success:false,message:"Invalid Credentials"});
        }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Something went wrong"});
    }
}

//API TO GET USER DATA
const getProfile = async (req,res) =>{

    try {

        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({success:true,userData});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Something went wrong"});
    }

}

//Update Profile
const updateProfile = async (req,res) =>{

    try {

        const {userId,name,phone,address,dob,gender} = req.body;
        const imageFile = req.file;

        if( !name || !phone  || !dob || !gender){
            return res.status(400).json({success:false,message:"All fields are required"});
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.stringify(address),dob,gender});

        if(imageFile){
            //Upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageUrl});
        }

        res.json({success:true,message:"Profile Updated"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Something went wrong"});
    }
}


//API to Book Appointment
const bookAppointment = async (req,res) =>{

    try {

        const {userId,docId,slotDate,slotTime} = req.body;

        const docData = await doctorModel.findById(docId).select('-password');

        if(!docData.available){
            return res.status(400).json({success:false,message:"Doctor is not available"});
        }

        let slots_booked = docData.slot_booked;

        //Check the slot availability
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.status(400).json({success:false,message:"Slot already booked"});
            }else{
                slots_booked[slotDate].push(slotTime);
            }
        }else{
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }


        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked

        const appoinmentData = {
            userId,
            docId,
            userData,
            docData,
            amount:docData.fees,
            slotTime,
            slotDate,
            date:Date.now()
        }

        const newAppoinment = new appointmentModel(appoinmentData);
        await newAppoinment.save();

        //save new slot data in doctor model
        await doctorModel.findByIdAndUpdate(docId,{slot_booked:slots_booked});

        res.json({success:true,message:"Appoinment Booked"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:"Something went wrong"});
    }

}

//Api to get user Appoijnmet data
const listAppoinments = async (req, res) => {
    try {
      const { userId } = req.body;
  
      // Log userId to ensure correct data is being passed
      console.log("User ID:", userId);
  
      // Query the database for appointments
      const appointments = await appointmentModel.find({ userId });
  
      // Log the result of the database query
      console.log("Appointments found:", appointments);
  
      if (appointments.length > 0) {
        res.json({ success: true, appointments });
      } else {
        res.json({ success: true, appointments: [] });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  };


  //Api to cancel Appoinment
  const cancelAppoinment = async (req, res) => {
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



export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppoinments,cancelAppoinment}
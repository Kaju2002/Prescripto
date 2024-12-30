import doctorModel from "../models/doctorModel.js";
import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appoinmentModel.js";

const changeAvailability = async (req, res) => {

    try {

        const {docId} = req.body


        const docData = await doctorModel.findById(docId);
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available});
        res.json({success:true,message:"Availability Updated"})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Something went wrong"})
    }
}


const doctorList = async (req, res) => {
    try {
        // Exclude 'password' and 'email' fields
        const doctors = await doctorModel.find({}).select('-password -email');

        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
};


//API for doctor login
const loginDoctor = async (req, res) => {

    try {

        const {email,password} = req.body;

        const doctor = await doctorModel.findOne({email});

    if(!doctor){
        return res.json({success:false,message:"Doctor does not exist"})
    }

    const isMatch = await bycrypt.compare(password,doctor.password);

    if(isMatch){
        const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET);
        res.json({success:true,token});
    }else{
        return res.json({success:false,message:"Invalid Credentials"})
    }
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}


//API to get doctor appoinment for doctor panel
const appointmentsDoctor = async (req, res) => {
    
    try {

        const {docId} = req.body
        const appoinments = await appointmentModel.find({docId});

        res.json({success:true,appoinments});


        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

//API to mark appoinment complete doctorn panel
const appoinmentComplete = async (req, res) => {
    try {

        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted:true})
            res.json({success:true,message:"Appoinment marked complete"})
        }else{
            res.json({success:false,message:"Invalid Appoinment"})
        }
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}


//API to cancell appoinment complete doctorn panel
const appoinmentCancel = async (req, res) => {
    try {

        const {docId,appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
            res.json({success:true,message:"Appoinment Cancelled"})
        }else{
            res.json({success:false,message:"Cancellation Failed"})
        }
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

//Api to get dashboard to doctorpanel
const doctorDashboard = async (req, res) => {
    
    try {

        const {docId} = req.body

        const appoinments = await appointmentModel.find({docId});

        let earning = 0

        appoinments.map((item)=>{

            if(item.isCompleted || item.payment){

                earning += item.amount
            }
        })

        let patients = []

        appoinments.map((item)=>{
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earning,
            appoinments:appoinments.length,
            patients:patients.length,
            latestAppoinments:appoinments.reverse().slice(0,5)
        }

        res.json({ success: true, dashData });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}

//API to get doctor profile for doctor panel
const doctorProfile = async (req, res) => {
    try {

        const {docId} = req.body

        const profileData = await doctorModel.findById(docId).select('-password');

        res.json({success:true,profileData});
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}



//Api to udpate doctor profile from doctor panel
const updateDoctorProfile = async (req, res) => {
    
    try {

        const {docId,fees,address,available} = req.body

        await doctorModel.findByIdAndUpdate(docId,{fees,address,available});

        res.json({success:true,message:"Profile Updated"});
        
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.json({ success: false, message: "Something went wrong" });
    }
}
export {changeAvailability,doctorList,loginDoctor,appointmentsDoctor,appoinmentComplete,appoinmentCancel,doctorDashboard,doctorProfile,updateDoctorProfile}
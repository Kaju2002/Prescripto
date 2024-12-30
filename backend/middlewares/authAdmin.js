import jwt from 'jsonwebtoken';

//admin authendication middleware
const authAdmin = async(req,res,next)=>{
    try {
        const {atoken} = req.headers
        if(!atoken){
            return res.json({message:"Not authorized Login Again!!"});
        }

        const token_decode = jwt.verify(atoken,process.env.JWT_SECRET);

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({message:"Not authorized Login Again!!"});
        }

        next();
        
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"})
    }

}

export default authAdmin
import jwt from 'jsonwebtoken';

//user authendication middleware
const authUser = async(req,res,next)=>{
    try {
        const {token} = req.headers
        if(!token){
            return res.json({message:"Not authorized Login Again!!"});
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRET);

        req.body.userId = token_decode.id

        next();
        
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"})
    }

}

export default authUser
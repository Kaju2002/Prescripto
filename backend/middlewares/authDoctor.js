import jwt from 'jsonwebtoken';

//doctor authendication middleware
const authDoctor = async(req,res,next)=>{
    try {
        const {dtoken} = req.headers
        if(!dtoken){
            return res.json({message:"Not authorized Login Again!!"});
        }

        const token_decode = jwt.verify(dtoken,process.env.JWT_SECRET);

        req.body.docId = token_decode.id

        next();
        
    } catch (error) {
        console.log(error);
        res.json({message:"Something went wrong"})
    }

}

export default authDoctor
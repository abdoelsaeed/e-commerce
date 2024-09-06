import AppError from "./../errFolder/err"

const handleCastErrorDB=(err:{path:any,value:any})=>{
    const message=`Invalid ${err.path}: ${err.value}`
    return new AppError(message,400);
}
const handleDuplicateFieldsDB=(err:any)=>{
    const value=err.errmsg.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
    const message=`Duplicate field value ${value}, Please enter another value`;
    return new AppError(message,400);
}
const handleValidationErrorDB=(err:any)=>{
    const message=Object.values(err.errors).map((err:any)=>err.message).join(". ");
    console.log(12)
    return new AppError(message,400);
}
const handleJsonWebTokenError=()=>{
    const message=`Invalid token,Please login again`;
    return new AppError(message,401);
}
const handleTokenExpiredError=()=>{
    const message=`Tokes expired,Please login again`;
    return new AppError(message,401);
}
const sendErrorDev=(err:any,req:any,res:any)=>{
    if(req.originalUrl.startsWith("/api")) {
        return res.status(err.statusCode).json({
            message: err.message,
            status: err.status,
            stack: err.stack,
            error: err
        })
    }
    console.error("Error 💣️💣️💣️", err);
    res.status(err.statusCode).send(err.message)

}
const sendErrorProd=(err:any,req:any,res:any)=>{
    if(req.originalUrl.startsWith("/api")) {
        if (err.isOperational) {
            return res.status(err.statusCode).json(
                {
                    message: err.message,
                    status: err.status,
                }
            )
        }
        //programming errors
        console.error("Error 💣️💣️💣️", err)
        return res.status(500).json(
            {
                message: "Something went wrong",
                status: "error",
            }
        )
    }
    //RENDRING ERROR
    if (err.isOperational) {
        console.error("Error 💣️💣️💣️", err);
        return res.status(err.statusCode).render('error',{
            msg: err.message,
            title:'error',
        })
    }
    //programming errors
    console.error("Error 💣️💣️💣️", err)
    return res.status(500).render('error',
        {
            msg: "Something went wrong",
            title: "error",
        }
    )


}
export  default (err:any,req:any,res:any,next:any)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||"error";
    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,req,res);
    }else if(process.env.NODE_ENV==='production'){
        let error={...err};
        error.message=err.message;
        if(err.name==='CastError'){
            error=handleCastErrorDB(err);
        }
        if(err.name==='ValidationError'){
            error=handleValidationErrorDB(err);
        }
        if(err.code=== 11000){
            error=handleDuplicateFieldsDB(err);
        }
        if(err.name==="JsonWebTokenError"){
            error=handleJsonWebTokenError();
        }
        if(err.name==="TokenExpiredError"){
            error=handleTokenExpiredError();
        }

        sendErrorProd(error,req,res);
    }
}
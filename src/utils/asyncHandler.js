const asyncHandler = (requestHandler) => {
    return (req , res , next) => {
        Promise
        .resolve(()=>{
            requestHandler(res , req , next);
        })
        .catch((error)=> {
            next(error);
        })
    }
}

export {asyncHandler};


// const asyncHandlerTryCatch= (fn) => async (req , res , next) => {
//     try{
//         await fn(req , res , next)
//     }catch (err) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }

// }
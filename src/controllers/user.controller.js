import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deleteFileFromCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // adding value to database object
    user.refreshToken = refreshToken;
    // save data
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };

  } catch (error) {
    throw new ApiError(
      500,
      "Somthing went wrong while generating access and refresh token"
    );
  }
};
const registerUser = asyncHandler(async (req, res) => {
  // take data from user -> name email pass
  // apply validation if user has not sended empty user name or pass or email or email is in in-correct formate
  // check if user is already existed  , email) or not if yes then throw error
  // check for images, check for avatar
  // if availavble uploade in cloudinary, check avatart is uploaded in clloudinary
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check fro user creation
  // return response

  // taking data from frontend/user
  // object name must be same as frontend
  // fullName , email , password , userName  these name must be same in both frontend and backend

  try {
    const { fullName, email, password, userName } = req.body;

    if ((fullName == "" || email == "" || password == "", userName == "")) {
      return new ApiError(400, "All fields are Required");
    }

    let ad = 0;
    for (let i = 0; i < email.length; ++i) {
      if (email[i] == "@") ad++;
    }
    if (ad != 1) {
      return new ApiError(400, "type Correct email");
    }

    // To check single variable
    // const exixtedUser = User.findOne({userName})
    const exixtedUser = await User.findOne({
      $or: [{ userName }, { email }],
    });
    // console.log("Existed User : ", exixtedUser);
    if (exixtedUser) {
      return new ApiError(409, "User with email and Already Exist");
    }

    // handling file
    // console.log("req. files: " , req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0].path;

    let coverImageLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalPath = req.files.coverImage[0].path;
    }
    // we are checking only avatar because it is mandatory
    if (!avatarLocalPath) {
      return new ApiError(400, "Avatar is Required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
      return new ApiError(400, "Avatar is Required");
    }

    // creating user object
    const user = await User.create({
      userName: userName.toLowerCase(),
      fullName,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
    });


    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      return new ApiError(
        500,
        "Something went wrong while registering the user in db"
      );
    }

    // return res.status(201).json({createdUser})
    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User Register Successfully"));
  } catch (error) {
    return new ApiError(401, "Failed to Login User");
  }
});

const loggedInUser = asyncHandler(async (req, res) => {
  // rewq.body take data from user - > (username, email , passwred)
  // validate input fields are not empty and in correct formate
  // find user if it exist or not - > if not send to register page
  // encrypt pass & check password is correct or not
  // generate access and refresh token and send to user by secure cookies
  // if correct authenticate user tu accesss things

  const { email, userName, password } = req.body;
  console.log("User Name ", userName);
  // console.log(password);


  if (!userName && !email) {
    return new ApiError(400, "Email or UserName Requiyred");
  }

  const user = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (!user) {
    // return Error
    return new ApiError(404, "User Not Existed Go And Register");
    // send route to register page
  }



  // user is in small letter or same as my varabile name
  // it provides an instant of the usesr
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return new ApiError(401, "Invalid Password");
  }

  // generate and access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // to genetratee cookies we have to design some options
  const options = {
    httpOnly: true,
    secure: true,
  };


  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged in SuccessFully"
      )
    );
});

const loggedOutUser = asyncHandler(async (req, res) => {
  // need 


  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );


  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(200,
        {
          "user": `${user.userName} is Logged out`
        },
        "User Logged Out"));
});


const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie?.refreshToken || req.body?.refreshToken

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or used");
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken, refreshToken: newRefreshToken
          },
          "Access Token Refreshed")
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token")
  }

});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  // if taking newPass and ComfirmPass then add one condition to check both are equal or not

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    return new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Password is Changed")
    )

});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200,
        req.user,
        "Current User Featched Successfully")
    );
});


const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return new ApiError(400, "All Fields Are Required");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName, //because of ES6 we are writing fullName otherwise we have to write fullName : fullName
        email
      }
    },
    {
      new: true // this will return updated user value
    }
  ).select("-password")

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account Details updated Successfully"));



});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiResponse(400, "Upload file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiResponse(400, "Error while uploading avatar");
  }

  // delete old cloudinary image
  try {
    //TODO delete old imge
    const delUser = await User.findById(req.user?._id)
    await deleteFileFromCloudinary(delUser?.avatar);
    console.log("Cloudinary file Deleted Successfully");
  } catch (error) {
    console.log("Not Able to delete Cloudinary file");

  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url
      }
    }, { new: true } // this will return the user with updated user details
  ).select("-password")

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Avatar image updated successfully")
    )
});


const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  if (!coverImageLocalPath) {
    throw new ApiResponse(400, "Upload  file is missing");
  }
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImage) {
    throw new ApiResponse(400, "Error while uploading Cover Image");
  }
  try {
    //TODO delete old imge
    const delUser = await User.findById(req.user?._id)
    await deleteFileFromCloudinary(delUser?.coverImage);
    console.log("Cloudinary file Deleted Successfully");
  } catch (error) {
    console.log("Not Able to delete Cloudinary file");

  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    }, { new: true } // this will return the user with updated user details
  ).select("-password")


  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Cover image updated successfully")
    );
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  // taking data from url by using req.params
  const { userName } = req.params;

  if (!userName?.trim()) {
    throw ApiError(400, "User Name is missing");
  }

  const channel = await User.aggregate([
    {
      $match: {
        userName: userName.toLowerCase()
      }
    },
    {
      // For All Subscriber and Subscriber Count
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      // To get  how many channel did i subscribed
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscriberCount: {
          $size: "$subscribers"
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo"
        },
        isSubscribed: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false
        }
      }
    },
    {
      $project:{
        fullName:1,
        userName:1,
        avatar:1,
        coverImage:1,
        subscriberCount:1,
        channelSubscribedToCount:1,
        isSubscribed:1,
        email:1
      }
    }
  ])
  
  if(!channel.length){
    throw ApiError(404, "Channel Does Not Exist");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(200,channel[0], "User Channel Featched Successfullt")
  )

});


export {
  registerUser,
  loggedInUser,
  loggedOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile
};

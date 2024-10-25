import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
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
    "-password -refreshtoken"
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
});

export { registerUser };

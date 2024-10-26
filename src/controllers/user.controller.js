import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // adding value to database object
    user.refreshtoken = refreshToken;
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

const loginUser = asyncHandler(async (req, res) => {
  // rewq.body take data from user - > (username, email , passwred)
  // validate input fields are not empty and in correct formate
  // find user if it exist or not - > if not send to register page
  // encrypt pass & check password is correct or not
  // generate access and refresh token and send to user by secure cookies
  // if correct authenticate user tu accesss things

  const { userName, email, password } = req.body;

  if (!userName || !email) {
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
  const isPasswordValid = await user.isPasswordValid(isPasswordCorrect);
  if (!isPasswordValid) {
    return new ApiError(401, "Invalid Password");
  }

  // generate and access token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );
  const loggedInUser = User.findById(user._id).select(
    "-password -refreshToken"
  );
  // to genetratee cookies we have to design some options
  const option = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(
        200,
        {
        user: loggedInUser,
        accessToken,
        refreshToken,
        },
        "User Logged in SuccessFully"
      ));
});
export { registerUser, loginUser };

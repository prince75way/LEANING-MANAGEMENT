import User from './user.schema';
import {UserDTO} from './user.dto';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../utils/tokenHelper';
import Course from '../courses/course.schema';
import jwt from 'jsonwebtoken';
export const signupService = async (userData: UserDTO) => {
  // Check if the user already exists
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }


  // Create a new user instance
  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'student', // Default to 'student'
  });

  // Save the user
  await newUser.save();

  // Generate JWT tokens for the new user
  const tokens = generateTokens(newUser._id.toString());


  newUser.accessToken = tokens.accessToken;
  newUser.refreshToken = tokens.refreshToken;
  await newUser.save();

  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

export const loginService = async (loginData: UserDTO) => {
  // Check if user exists
  const user = await User.findOne({ email: loginData.email });
  if (!user) {
    throw new Error('NO SUCH USER EXIST');
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(loginData.password, user.password);
  // console.log("isMatch",isMatch)
  if (!isMatch) {
    throw new Error ('Invalid credentials');
  }


  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
};


export const updateUserProgressService = async (userId: string, courseId: string, moduleId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Find the course progress for the given courseId
  let courseProgress = user.courseProgress.find(progress => progress.courseId.toString() === courseId);

  // console.log('courseProgress:', courseProgress);

  if (!courseProgress) {
    // Add new courseProgress entry if it doesn't exist
    courseProgress = { courseId, watchedModules: [] };
    user.courseProgress.push(courseProgress);
  }

  // Check if moduleId is already in the watchedModules array
  if (courseProgress.watchedModules.includes(moduleId)) {
    throw new Error('Module already watched');
  }

  // console.log(moduleId,"moduleis")

   courseProgress.watchedModules.push(moduleId);

  // Mark the courseProgress field as modified to trigger a save
  user.markModified('courseProgress');
  await user.save();

  return { courseId, watchedModules: courseProgress.watchedModules };
};


export const getUserProgressService = async (userId: string) => {
  const user = await User.findById(userId).populate('courseProgress.courseId', 'title modules').exec();

  if (!user) {
    throw new Error('User not found');
  }

  const progressDetails = await Promise.all(user.courseProgress.map(async (progress) => {
    const course = await Course.findById(progress.courseId).populate('modules').exec();

    if (!course) {
      return null;
    }

    const totalModules = course.modules.length;
    const watchedModulesCount = progress.watchedModules.length;
    const progressPercentage = totalModules ? (watchedModulesCount / totalModules) * 100 : 0;

    return {
      courseId: course._id,
      courseTitle: course.title,
      totalModules,
      watchedModules: watchedModulesCount,
      progressPercentage: progressPercentage.toFixed(2),
    };
  }));

  return progressDetails.filter((detail) => detail !== null);  // Remove null values in case any course was not found
};




// Refresh Access Token Logic
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  // Verify the refresh token
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    const userId = decoded.userId;

    // Find the user in the database
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Generate a new access token
    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1h' } // Access token expiration time
    );

    // Optionally, you can update the access token in the database if required
    // Example: Saving the new access token (not typical but could be useful for tracking)
    user.accessToken = newAccessToken;
    await user.save();

    return newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};



  
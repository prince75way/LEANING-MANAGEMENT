import { getCourseById } from '../courses/course.service';  
import User from './user.schema';
import {UserDTO} from './user.dto';
import bcrypt from 'bcrypt';
import { generateTokens } from '../../utils/tokenHelper';
import jwt from 'jsonwebtoken';

/**
 * Signs up a new user.
 *
 * @param {UserDTO} userData - The user data to sign up with.
 * @throws {Error} If a user with the same email already exists.
 * @returns {Promise<{
 *   id: string,
 *   name: string,
 *   email: string,
 *   role: 'student' | 'instructor',
 *   accessToken: string,
 *   refreshToken: string,
 * }>} - The signed up user with JWT tokens.
 */
export const signupService = async (userData: UserDTO) => {
 
  const existingUser = await User.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }


  const newUser = new User({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'student', 
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

  /**
   * Handles user login.
   *
   * @param {UserDTO} loginData - The data for the user to login.
   * @returns {Promise<{accessToken: string, refreshToken: string}>} - The access and refresh tokens for the user.
   * @throws Error - If the user does not exist or the credentials are invalid.
   */
export const loginService = async (loginData: UserDTO) => {

  const user = await User.findOne({ email: loginData.email });
  if (!user) {
    throw new Error('NO SUCH USER EXIST');
  }

  // Compare the provided password with the stored hashed password
  const isMatch = await bcrypt.compare(loginData.password, user.password);
  
  if (!isMatch) {
    throw new Error ('Invalid credentials');
  }


  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
};



  /**
   * Updates the watched modules for a given course in the user's progress.
   *
   * @param {string} userId - The user ID to update.
   * @param {string} courseId - The course ID to update.
   * @param {string} moduleId - The module ID to add to the watchedModules array.
   * @returns {Promise<{ courseId: string, watchedModules: string[] }>} - The updated course progress.
   * @throws Error - If the user is not found or the module is already watched.
   */
export const updateUserProgressService = async (userId: string, courseId: string, moduleId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Find the course progress for the given courseId
  let courseProgress = user.courseProgress.find(progress => progress.courseId.toString() === courseId);



  if (!courseProgress) {

    courseProgress = { courseId, watchedModules: [] };
    user.courseProgress.push(courseProgress);
  }

 
  if (courseProgress.watchedModules.includes(moduleId)) {
    throw new Error('Module already watched');
  }


   courseProgress.watchedModules.push(moduleId);

  // Mark the courseProgress field as modified to trigger a save
  user.markModified('courseProgress');
  await user.save();

  return { courseId, watchedModules: courseProgress.watchedModules };
};



  /**
   * Retrieves the progress of the user for all enrolled courses.
   *
   * @param {string} userId - The user ID to retrieve progress for.
   * @returns {Promise<Array<{ courseId: string, courseTitle: string, totalModules: number, watchedModules: number, progressPercentage: string }>>} - The user's progress details.
   * @throws Error - If the user is not found.
   */
// user.service.ts

export const getUserProgressService = async (userId: string) => {
  const user = await User.findById(userId).populate('courseProgress.courseId', 'title modules').exec();

  if (!user) {
    throw new Error('User not found');
  }

  const progressDetails = await Promise.all(user.courseProgress.map(async (progress) => {
    const course = await getCourseById(progress.courseId.toString());  

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




/**
 * Refreshes the access token using the provided refresh token.
 *
 * @param {string} refreshToken - The refresh token to verify.
 * @returns {Promise<string>} - The new access token.
 * @throws Error - If the user is not found or the refresh token is invalid.
 */
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

  


/**
 * Enroll a user into a course by adding the course to their progress.
 * 
 * @param {string} userId - The ID of the user.
 * @param {string} courseId - The ID of the course to enroll in.
 * @returns {Promise<User>} - The updated user document.
 */
export const addCourseToUserProgressService = async (userId: string, courseId: string): Promise< UserDTO> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Add course progress to the user's profile
  user.courseProgress.push({ courseId, watchedModules: [] });
  await user.save();
  
  return user;
};
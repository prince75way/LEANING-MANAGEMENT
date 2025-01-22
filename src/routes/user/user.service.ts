import { AppDataSource } from '../../services/databasetypeorm'; // Import your data source
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from './user.entity';
import { UserDTO } from './user.dto';
import { Course } from '../course/course.entity';
import { generateTokens } from '../../utils/tokenHelper';
// Repositories
const userRepository = AppDataSource.getRepository(User);
const courseRepository = AppDataSource.getRepository(Course);

/**
 * Signs up a new user.
 */
export const signupService = async (userData: UserDTO) => {
  const existingUser = await userRepository.findOneBy({ email: userData.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const newUser = await userRepository.create({
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role || 'student',
  });

  await userRepository.save(newUser);
  const tokens = generateTokens(newUser.id);

  newUser.accessToken = tokens.accessToken;
  newUser.refreshToken = tokens.refreshToken;
  await userRepository.save(newUser);

  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,

    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
};

/**
 * Handles user login.
 */
export const loginService = async (loginData: UserDTO) => {
  const user = await userRepository.findOneBy({ email: loginData.email });
  if (!user) {
    throw new Error('User does not exist');
  }

  console.log("password is: ",loginData.password)

//   const isMatch = await bcrypt.compare(loginData.password, user.password);
const isMatch=await user.comparePassword(loginData.password)
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };
};

/**
 * Updates watched modules for a given course in user's progress.
 */
export const updateUserProgressService = async (userId: string, courseId: string, moduleId: string) => {
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['courseProgress'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  let courseProgress = user.courseProgress.find((progress) => progress.courseId.id === courseId);

  if (!courseProgress) {
    courseProgress = { id: '', user: user, courseId: { id: courseId } as Course, watchedModules: [] };
    user.courseProgress.push(courseProgress);
  }

  if (courseProgress.watchedModules.includes(moduleId)) {
    throw new Error('Module already watched');
  }

  courseProgress.watchedModules.push(moduleId);
  await userRepository.save(user);

  return { courseId, watchedModules: courseProgress.watchedModules };
};

/**
 * Retrieves user progress for all enrolled courses.
 */
export const getUserProgressService = async (userId: string) => {
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['courseProgress.course'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  const progressDetails = await Promise.all(
    user.courseProgress.map(async (progress) => {
      const course = await courseRepository.findOne({
        where: { id: progress.courseId.id },
        relations: ['modules'],
      });

      if (!course) {
        return null;
      }

      const totalModules = course.modules.length;
      const watchedModulesCount = progress.watchedModules.length;
      const progressPercentage = totalModules ? (watchedModulesCount / totalModules) * 100 : 0;

      return {
        courseId: course.id,
        courseTitle: course.title,
        totalModules,
        watchedModules: watchedModulesCount,
        progressPercentage: progressPercentage.toFixed(2),
      };
    })
  );

  return progressDetails.filter((detail) => detail !== null);
};

/**
 * Refreshes access token.
 */
export const refreshAccessToken = async (refreshToken: string): Promise<string> => {
  try {
    const decoded: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string);
    const userId = decoded.userId;

    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: '1h' }
    );

    user.accessToken = newAccessToken;
    await userRepository.save(user);

    return newAccessToken;
  } catch (error) {
    throw new Error('Failed to refresh access token');
  }
};

/**
 * Enrolls a user into a course.
 */
export const addCourseToUserProgressService = async (userId: string, courseId: string) => {
  const user = await userRepository.findOne({
    where: { id: userId },
    relations: ['courseProgress'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  const course = await courseRepository.findOneBy({ id: courseId });
  if (!course) {
    throw new Error('Course not found');
  }
  user.courseProgress.push({ id: '', user: user, courseId: course, watchedModules: [] });
  await userRepository.save(user);

  return user;
};

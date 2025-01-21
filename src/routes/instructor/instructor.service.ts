import { InstructorDTO } from './instructor.dto';
import { Instructor } from './instructor.schema';
import { generateTokens } from '../../utils/tokenHelper';

/**
 * Onboards a new instructor by checking if the instructor exists,
 * creating a new instructor, generating access and refresh tokens,
 * and saving the instructor with tokens.
 * 
 * @param {InstructorDTO} instructorData - The data to create a new instructor.
 * @returns {Promise<Object>} - The onboarded instructor details along with generated tokens.
 * @throws {Error} - If the instructor already exists.
 */
export const onboardInstructorService = async (instructorData: InstructorDTO) => {
  const existingInstructor = await Instructor.findOne({ email: instructorData.email });
  if (existingInstructor) {
    throw new Error('Instructor with this email already exists');
  }

  const newInstructor = new Instructor({
    name: instructorData.name,
    email: instructorData.email,
    password: instructorData.password,
    role: 'instructor',
    qualifications: instructorData.qualifications,
    experience: instructorData.experience,
  });

  await newInstructor.save();

  const tokens = generateTokens((newInstructor._id as unknown as string).toString());

  newInstructor.accessToken = tokens.accessToken;
  newInstructor.refreshToken = tokens.refreshToken;

  await newInstructor.save();

  return {
    id: newInstructor._id,
    name: newInstructor.name,
    email: newInstructor.email,
    role: newInstructor.role,
    qualifications: newInstructor.qualifications,
    experience: newInstructor.experience,
    accessToken: newInstructor.accessToken,
    refreshToken: newInstructor.refreshToken,
  };
};

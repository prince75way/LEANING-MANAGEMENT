import { InstructorDTO } from './instructor.dto';
import { Instructor } from './instructor.schema';
import { generateTokens } from '../../utils/tokenHelper';  // Import the token helper

export const onboardInstructorService = async (instructorData: InstructorDTO) => {
  // Check if the instructor already exists
  const existingInstructor = await Instructor.findOne({ email: instructorData.email });
  if (existingInstructor) {
    throw new Error('Instructor with this email already exists');
  }

  // Create a new instructor instance
  const newInstructor = new Instructor({
    name: instructorData.name,
    email: instructorData.email,
    password: instructorData.password, // Password will be hashed by pre-save hook
    role: 'instructor',
    qualifications: instructorData.qualifications,
    experience: instructorData.experience,
  });

  // Save the instructor to the database
  await newInstructor.save();

  // Generate access and refresh tokens
  const tokens = generateTokens((newInstructor._id as unknown as string).toString()); // Use the new instructor's ID for token generation

  // You can store the tokens in the instructor document if required, or return them
  newInstructor.accessToken = tokens.accessToken;
  newInstructor.refreshToken = tokens.refreshToken;

  // Save the updated instructor with tokens
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

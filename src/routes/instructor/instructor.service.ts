import { InstructorDTO } from './instructor.dto';
import { Instructor } from './instructor.entity';
import { AppDataSource } from '../../services/databasetypeorm';
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

  const instructorRepository = AppDataSource.getRepository(Instructor);


  const existingInstructor = await instructorRepository.findOne({
    where: { email: instructorData.email },
  });

  if (existingInstructor) {
    throw new Error('Instructor with this email already exists');
  }

  // Create a new Instructor instance
  const newInstructor = instructorRepository.create({
    name: instructorData.name,
    email: instructorData.email,
    password: instructorData.password,
    qualifications: instructorData.qualifications,
    experience: instructorData.experience,
  });

  await instructorRepository.save(newInstructor);

  const tokens = generateTokens(newInstructor.id);

  newInstructor.accessToken = tokens.accessToken;
  newInstructor.refreshToken = tokens.refreshToken;


  await instructorRepository.save(newInstructor);

  
  return {
    id: newInstructor.id,
    name: newInstructor.name,
    email: newInstructor.email,
    qualifications: newInstructor.qualifications,
    experience: newInstructor.experience,
    accessToken: newInstructor.accessToken,
    refreshToken: newInstructor.refreshToken,
  };
};

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserDTO } from './user.dto'; // Interface file

// Define a nested schema for CourseProgress to be used in the user schema
interface CourseProgress {
  courseId: Object;
  watchedModules: string[];
}

interface UserWithProgress extends UserDTO {
  courseProgress: CourseProgress[];
}

const courseProgressSchema = new Schema<CourseProgress>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  watchedModules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
}, { _id: false });

const userSchema: Schema<UserWithProgress> = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
  courseProgress: [courseProgressSchema],  // Array of course progress objects
}, { timestamps: true });

// Pre-save hook for hashing passwords
userSchema.pre<UserDTO>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<UserWithProgress>('User', userSchema);
export default User;

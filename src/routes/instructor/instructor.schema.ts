import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IInstructor extends Document {
  name: string;
  email: string;
  password: string;
  role: 'instructor';
  qualifications: string[];
  experience: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const instructorSchema: Schema<IInstructor> = new Schema({
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
  qualifications: {
    type: [String],
    required: true,
  },
  experience: {
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
}, { timestamps: true });

// Pre-save hook for password hashing
instructorSchema.pre<IInstructor>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err:any) {
    next(err);
  }
});

// Method for comparing passwords
instructorSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const Instructor = mongoose.model<IInstructor>('Instructor', instructorSchema);

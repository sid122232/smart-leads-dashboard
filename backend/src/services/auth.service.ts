import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { config } from '../config';
import { JwtPayload, UserRole } from '../types';
import { AppError } from '../middleware/errorHandler';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: Omit<IUser, 'password'>;
  token: string;
}

const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);
};

export const registerUser = async (input: RegisterInput): Promise<AuthResult> => {
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create(input);

  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const token = signToken(payload);

  return { user: user.toObject() as Omit<IUser, 'password'>, token };
};

export const loginUser = async (input: LoginInput): Promise<AuthResult> => {
  // Explicitly select password for comparison (excluded by default)
  const user = await User.findOne({ email: input.email }).select('+password');

  if (!user) {
    // Generic message to avoid user enumeration
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const payload: JwtPayload = {
    userId: user._id.toString(),
    role: user.role,
    email: user.email,
  };

  const token = signToken(payload);

  return { user: user.toObject() as Omit<IUser, 'password'>, token };
};

export const getUserById = async (userId: string): Promise<IUser> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found.', 404);
  }
  return user;
};
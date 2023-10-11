import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { duplicatedEmailError } from '../errors/index';
import { userRepository } from '../repositories/index';

export async function createUser({ email, password }: CreateUserParams): Promise<User> {
  
 const userWithSameEmail = await userRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw duplicatedEmailError();
    }

  const hashedPassword = await bcrypt.hash(password, 10);
  return userRepository.create({
    email,
    password: hashedPassword,
  });
}

export type CreateUserParams = Pick<User, 'email' | 'password'>;

export const userService = {
  createUser
};

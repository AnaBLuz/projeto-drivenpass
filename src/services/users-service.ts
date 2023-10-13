import { User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { duplicatedEmailError, invalidCredentialsError} from '../errors/index';
import { userRepository } from '../repositories/index';
import { exclude } from '../utils/prisma-utils';


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

async function signIn(params: SignInParams): Promise<SignInResult> {
  const { email, password } = params;

  const user = await userRepository.findByEmail(email, { id: true, email: true, password: true });
  if (!user) throw invalidCredentialsError();

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw invalidCredentialsError();

  const token = await createSession(user.id);

  return {
    user: exclude(user, 'password'),
    token,
  };
}


async function createSession(userId: number) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  await userRepository.createSession({
    token,
    userId,
  });

  return token;
}



export type SignInParams = Pick<User, 'email' | 'password'>;

type SignInResult = {
  user: Pick<User, 'id' | 'email'>;
  token: string;
};




export const userService = {
  createUser,
  signIn
};

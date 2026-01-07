import bcrypt from "bcrypt";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import { findUserByEmail } from "../../../helpers/userHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TLogin = {
  email: string;
  password: string;
};

const login = async (payload: TLogin) => {
  // find user
  // check whether password correct
  // generate access and refresh token
  // return data
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const register = async (payload: any) => {
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const userData = {
    ...payload,
    password: hashedPassword,
  };

  const result = await prisma.user.create({
    data: userData,
  });

  const { password, ...userWithoutPassword } = result;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as Secret
    );
  } catch (err) {
    throw new ApiError(403, "Invalid Refresh Token");
  }

  const { id } = verifiedToken;

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const { password: _, ...userWithoutPassword } = user;

  const newAccessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};


export const AuthServices = {
  login,
  register,
  refreshToken,
};

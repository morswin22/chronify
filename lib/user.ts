import { db } from "@/lib/db";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const isUserValid = async (user: User) => {
  const storedUser = await db("users").where({ id: user.id }).first();

  if (!storedUser || storedUser.password !== user.password)
    return null;

  return storedUser as User;
};

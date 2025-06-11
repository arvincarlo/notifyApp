import { Random } from "mockjs";
export const mockLoginAPI = async (username: string, password: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (username === "admin" && password === "password123") {
    return {
      token: `${Random.string("lower", 32)}`,
      user: {
        id: 1,
        username: `${Random.name()}`,
        name: `${Random.first()} ${Random.last()}`,
      },
    };
  }
  throw new Error("Invalid credentials");
};

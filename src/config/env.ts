import dotenv from "dotenv";

dotenv.config();

export default (name: string): string => {
  const value = process.env[name];
  if (value) {
    return value;
  }

  console.error("Something wrong with .env file!");
  process.exit(1);
};

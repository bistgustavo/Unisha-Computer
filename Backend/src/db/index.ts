import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});


const connectDB = async () => {


  try {
    await prisma.$connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }

  return prisma;
}

export { connectDB , prisma };
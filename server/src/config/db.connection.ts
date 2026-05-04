import mongoose from "mongoose";
import { dburl } from "./system.variable";
import { local_local } from "./system.variable";

export const mongoConnection = async () => {
  try {
    await mongoose.connect(`${local_local}`);
    //await mongoose.connect(`${dburl}`);
    console.log("database connected");
  } catch (error) {
    console.log(error);
  }
};

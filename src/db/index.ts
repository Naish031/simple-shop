import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    if (mongoose.connections[0].readyState) return;

    const { connection } = await mongoose.connect(
      process.env.MONGODB_URI as string,
      {
        dbName: "simple-shop",
      }
    );

    if (connection.readyState === 1) {
      return Promise.resolve(true);
    }

    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    return Promise.reject(error);
  }
};

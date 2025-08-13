import User from "@/models/user.models";
import { UserTable } from "@/types/user.types";
import { connectDB } from "@/lib/db";
import type { MongooseUser } from "@/types/user.types";



export async function getUsers(): Promise<UserTable[]> {
  await connectDB();
  const users = await User.find().lean<MongooseUser[]>().exec();

  if (!users || users.length === 0) {
    return [];
  }

  return users.map((user) => ({
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
    isApproved: user.isApproved,
  }));
}

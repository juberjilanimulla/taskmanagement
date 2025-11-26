import { Schema, model, Document, Model } from "mongoose";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  mobile: string;
  email: string;
  password: string;
  description?: string;
  role: string;
  createdAt?: Date;
  updatedAt?: Date;
}

function currentLocalTimePlusOffset(): Date {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String },
    lastname: { type: String },
    mobile: { type: String },
    email: { type: String },
    password: { type: String },
    description: { type: String },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true, versionKey: false }
);

userSchema.pre<IUser>("save", function (next: any) {
  const currentTime = currentLocalTimePlusOffset();
  this.createdAt = currentTime;
  this.updatedAt = currentTime;
  next();
});

userSchema.pre("findOneAndUpdate", function (next: any) {
  const currentTime = currentLocalTimePlusOffset();
  this.set({ updatedAt: currentTime });
  next();
});

const usermodel: Model<IUser> = model<IUser>("user", userSchema);
export default usermodel;

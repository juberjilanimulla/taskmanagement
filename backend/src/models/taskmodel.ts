import { Schema, model, Document, Model } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  status: string;
  userid: Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

function currentLocalTimePlusOffset(): Date {
  const now = new Date();
  const offset = 5.5 * 60 * 60 * 1000;
  return new Date(now.getTime() + offset);
}

const taskSchema = new Schema<ITask>(
  {
    title: { type: String },
    description: { type: String },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    userid: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true, versionKey: false }
);

taskSchema.pre<ITask>("save", function (next: any) {
  const currentTime = currentLocalTimePlusOffset();
  this.createdAt = currentTime;
  this.updatedAt = currentTime;
  next();
});

taskSchema.pre("findOneAndUpdate", function (next: any) {
  const currentTime = currentLocalTimePlusOffset();
  this.set({ updatedAt: currentTime });
  next();
});

const taskmodel: Model<ITask> = model<ITask>("Task", taskSchema);
export default taskmodel;

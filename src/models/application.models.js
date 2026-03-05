import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    event: {
      type: String,
      required: true,
    },

    eventId: {
      type: String,
      required: true,
    },

    paymentMode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },

    paymentProof: {
      type: String, // store file URL (Cloudinary, Drive, S3 etc.)
      default: null,
    },

    registrationType: {
      type: String,
      enum: ["solo", "team"],
      default: "solo",
    },

    teamName: {
      type: String,
      default: "",
    },

    teamMembers: {
      type: [String], // array of member names
      default: [],
    },

    status: {
      type: String,
      default: "Pending",
    },
    DRP: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export default mongoose.model("Application", ApplicationSchema);

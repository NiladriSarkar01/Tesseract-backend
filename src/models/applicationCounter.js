import mongoose from "mongoose";

const ApplicationCounterSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
const ApplicationCounter = mongoose.model(
  "ApplicationCounter",
  ApplicationCounterSchema
);

export default ApplicationCounter;

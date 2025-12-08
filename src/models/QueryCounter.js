import mongoose from "mongoose";

const QueryCounterSchema = new mongoose.Schema({
  name: String,
  value: Number,
});
const QueryCounter = mongoose.model("QueryCounter", QueryCounterSchema);

export default QueryCounter;

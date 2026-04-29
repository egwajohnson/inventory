import mongoose, {Types} from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryId: { type: Types.ObjectId, required: true },
  name: { type: String, required: true, unique: true, maxlength: 100 },
  description: { type: String, optional: true, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const CategoryModel = mongoose.model("Category", categorySchema);

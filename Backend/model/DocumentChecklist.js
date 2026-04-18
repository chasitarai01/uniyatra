import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  label: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const documentChecklistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  category: { type: String, required: true },
  items: [itemSchema],
  completionPercent: { type: Number, default: 0 },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const DocumentChecklist = mongoose.model('DocumentChecklist', documentChecklistSchema);
export default DocumentChecklist;
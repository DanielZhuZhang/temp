import mongoose from 'mongoose';

// Define Schema
const dataSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    PassWord: { type: String, required: true },
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Major: { type: String, required: true },
    estimatedBirthYear: { type: Number },
});

// Export Model
const DataModel = mongoose.models.Data || mongoose.model('Data', dataSchema);
export default DataModel;

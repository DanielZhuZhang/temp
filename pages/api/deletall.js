import mongoose from "mongoose";
import DataModel from "../server/models/DataModel.js"; // Adjust path as needed

const mongoURI = 'mongodb+srv://danielzhuzhang:sFE02PA19LmRajpi@cluster0.d1zq8.mongodb.net/';

async function deleteAllData() {
    try {
        await mongoose.connect(mongoURI);
        console.log("✅ Connected to MongoDB");

        const result = await DataModel.deleteMany({});
        console.log(`🗑️ Deleted ${result.deletedCount} documents from DataModel`);

        mongoose.connection.close();
        console.log("🔌 Disconnected from MongoDB");
    } catch (error) {
        console.error("❌ Error deleting data:", error);
    }
}
//function i just created to use to clear database not used within the code
deleteAllData();

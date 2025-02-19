import mongoose from "mongoose";
import DataModel from "../server/models/DataModel";

const mongoURI = 'mongodb+srv://danielzhuzhang:sFE02PA19LmRajpi@cluster0.d1zq8.mongodb.net/';

if (!mongoose.connections[0].readyState) {
    console.log("Attempting to connect to MongoDB...");
    mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log("Successfully connected to MongoDB"))
        .catch(err => console.error("MongoDB Connection Error:", err));
}

export async function checkCredentials(username, password) {
    console.log(`Checking credentials for user: ${username}`);

    try {
        console.log("Querying MongoDB for user...");
        let user = await DataModel.findOne({ UserName: username });

        if (!user) {
            console.log(`User "${username}" not found. Creating a new user...`);
        } else {
            console.log(`User "${username}" found in database.`);

            if (user.PassWord !== password) {
                console.log(`Incorrect password for user: ${username}`);
                return null;
            }

            console.log(`Authentication successful for user: ${username}`);
        }

        console.log("Returning user data...");
        console.log({ UserName: username });
        return { UserName: username };

    } catch (err) {
        console.error("Error during authentication process:", err);
        return null;
    }
}

import mongoose from "mongoose";
import DataModel from "../server/models/DataModel";

export default async function handler(req, res) {
    if (req.method === "POST") {
        console.log("Received Submission Request:", req.body);

        const { Name, Age, Major, UserName, PassWord } = req.body;
        console.log(req.body);

        if (!UserName || !PassWord) {
            return res.status(400).json({ error: "Username and Password are required!" });
        }

        const currentYear = new Date().getFullYear();
        const estimatedBirthYear = currentYear - parseInt(Age, 10);

        const newEntry = new DataModel({
            Name,
            Age: parseInt(Age),
            Major,
            estimatedBirthYear,
            UserName,
            PassWord
        });

        try {
            await newEntry.save();
            console.log("Entry successfully added to the database!");
            res.status(200).json({ message: "Entry added successfully!" });
        } catch (error) {
            console.error("Error saving entry:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

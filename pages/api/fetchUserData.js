import mongoose from 'mongoose';
import DataModel from '../server/models/DataModel';

const mongoURI = 'mongodb+srv://danielzhuzhang:sFE02PA19LmRajpi@cluster0.d1zq8.mongodb.net/';

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Connection error:', err));

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { username, password } = req.body;
            console.log("Looking for entries with:", username, password);

            const data = await DataModel.find({ UserName: username, PassWord: password });

            if (data.length > 0) {
                console.log("Data found:", data);
                return res.status(200).json(data);
            } else {
                console.log("No data found");
                return res.status(404).json({ error: 'No data found for the provided credentials' });
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

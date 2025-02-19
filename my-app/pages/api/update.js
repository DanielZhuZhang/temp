import mongoose from 'mongoose';
import DataModel from '../server/models/DataModel';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            if (!Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({ error: 'Invalid request format' });
            }

            const firstEntry = req.body[0];
            const { UserName, PassWord } = firstEntry;

            console.log(`Updating data for user: ${UserName}`);

            const result = await DataModel.deleteMany({ UserName, PassWord });
            console.log(`${result.deletedCount} documents deleted.`);

            const insertedData = await DataModel.insertMany(req.body);
            console.log(`${insertedData.length} new documents inserted.`);

            return res.status(200).json({ message: 'Data updated successfully!' });
        } catch (error) {
            console.error("Error updating data:", error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

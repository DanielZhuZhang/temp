const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

const mongoURI = 'mongodb+srv://danielzhuzhang:sFE02PA19LmRajpi@cluster0.d1zq8.mongodb.net/';

mongoose
    .connect(mongoURI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Connection error:', err));


const dataSchema = new mongoose.Schema({
    UserName: { type: String, required: true },
    PassWord: { type: String, required: true },
    Name: { type: String, required: true },
    Age: { type: Number, required: true },
    Major: { type: String, required: true },
    estimatedBirthYear: { type: Number },
});

const DataModel = mongoose.model('Data', dataSchema);

app.get('/', (req, res) => {
    console.log('Serving index.html');
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/fetch', async (req, res) => {
        const { username, password } = req.body;

        console.log("Looking for entries with", username, password);
        const data = await DataModel.find({ UserName: username, PassWord: password });
        console.log("data", data);
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'No data found for the provided credentials' });
        }
});


app.post('/submit', async (req, res) => {
        console.log("body is:", req.body);
        const newEntry = req.body;
        const currentYear = new Date().getFullYear();
        newEntry.Age = parseInt(newEntry.Age);
        newEntry.estimatedBirthYear = currentYear - newEntry.Age;

        console.log(newEntry);

        const data = new DataModel(newEntry);
        await data.save();

        res.status(200).send('Entry added successfully!');
});

app.post('/update', async (req, res) => {
        const firstEntry = req.body[0];
        const { UserName, PassWord } = firstEntry;


        const result = await DataModel.deleteMany({ UserName, PassWord });
        console.log(`${result.deletedCount} documents deleted.`);


        await DataModel.insertMany(req.body);
        res.status(200).send('Data updated successfully!');
});



app.use((req, res) => {
    res.status(404).send('404: Page not found');
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

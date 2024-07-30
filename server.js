const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const data = require('./data.json');

const app = express();
const PORT = 3000;


app.use(cors());


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/data',(req,res)=>{
    res.json(data)
})

app.get('/datetime', (req, res) => {
    const currentDateTime = new Date();
    const dateTimeObject = {
        date: currentDateTime.toLocaleDateString('th-TH'),
        time: currentDateTime.toLocaleTimeString('th-TH')
    };
    res.json(dateTimeObject);
});


app.post('/upload', upload.single('dutyPhoto'), (req, res) => {
    const { studentName, dutyDate } = req.body;
    const dutyPhoto = req.file.path;

    
    const data = {
        studentName,
        dutyDate,
        dutyPhoto
    };

    
    let jsonData = [];
    const dataFilePath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataFilePath)) {
        const fileData = fs.readFileSync(dataFilePath, 'utf8');
        if (fileData) {
            jsonData = JSON.parse(fileData);
        }
    }

    
    jsonData.push(data);

    
    fs.writeFileSync(dataFilePath, JSON.stringify(jsonData, null, 2), 'utf8');

    res.json({ success: true, data });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

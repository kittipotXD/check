const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/data.json', express.static(path.join(__dirname, 'data.json')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ฟังก์ชันเพื่อเปรียบเทียบข้อมูล
function compareData(localData, externalData) {
    return {
        localData,
        externalData
    };
}

// ฟังก์ชันเพื่ออัพเดตข้อมูลในไฟล์ data.json
function updateLocalData(newData) {
    const dataFilePath = path.join(__dirname, 'data.json');
    fs.writeFileSync(dataFilePath, JSON.stringify(newData, null, 2), 'utf8');
}

// Endpoint เพื่อดึงข้อมูลจาก API ภายนอกและเปรียบเทียบกับข้อมูลในไฟล์ data.json
app.get('/check-data', async (req, res) => {
    try {
        // ดึงข้อมูลจาก API ภายนอก
        const response = await axios.get('https://check.pa63.thistine.com/');
        const externalData = response.data;

        // อ่านข้อมูลในไฟล์ data.json
        const dataFilePath = path.join(__dirname, 'data.json');
        let localData = [];
        if (fs.existsSync(dataFilePath)) {
            const fileData = fs.readFileSync(dataFilePath, 'utf8');
            if (fileData) {
                localData = JSON.parse(fileData);
            }
        }

        // เปรียบเทียบข้อมูล
        const comparisonResult = compareData(localData, externalData);

        // อัพเดตข้อมูลในไฟล์ data.json ด้วยข้อมูลจาก API ภายนอก
        updateLocalData(externalData);

        res.json({ success: true, comparisonResult });
    } catch (error) {
        console.error('Error fetching or comparing data:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch or compare data' });
    }
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Endpoint เพื่อดึงข้อมูลวันที่และเวลา
app.get('/datetime', (req, res) => {
    const currentDateTime = new Date();
    const dateTimeObject = {
        date: currentDateTime.toLocaleDateString('th-TH'),
        time: currentDateTime.toLocaleTimeString('th-TH')
    };
    res.json(dateTimeObject);
});

// Endpoint เพื่ออัพโหลดไฟล์และบันทึกข้อมูลในไฟล์ data.json
app.post('/upload', upload.single('dutyPhoto'), (req, res) => {
    const { studentName, dutyDate } = req.body;
    const dutyPhotoPath = req.file.path; // ใช้ path เดิม
    const dutyPhoto = `https://check.pa63.thistine.com/${dutyPhotoPath}`; // เปลี่ยนเป็น URL

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

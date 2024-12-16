const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors'); // CORS модулийг импортлох
const path = require('path'); // Замыг шийдвэрлэх модуль

const app = express(); // `app` хувьсагчийг зөвхөн нэг удаа зарлах

// Зөвшөөрөгдсөн гарал үүсэлүүд
const allowedOrigins = ['https://perweb-lnao.onrender.com'];

// CORS тохируулах
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`CORS бодлого: Зөвшөөрөгдөөгүй гарал үүсэл -> ${origin}`);
            callback(new Error('CORS бодлого зөрчигдсөн: Зөвшөөрөгдөөгүй гарал үүсэл'));
        }
    }
}));

// Body Parser тохируулах
app.use(bodyParser.json());

// Статик файлуудыг serve хийх
app.use(express.static(path.join(__dirname))); // Үндсэн фолдерыг serve хийх

// Root замд үндсэн HTML хуудсыг үзүүлэх
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Nodemailer тохируулах
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sotgonbaatar93@gmail.com', // Таны Gmail хаяг
        pass: 'rihnduutwutjboom',         // Gmail App Password
    }
});

// Имэйл илгээх API
app.post('/send-email', (req, res) => {
    const { email, subject, text } = req.body;

    const mailOptions = {
        from: 'sotgonbaatar93@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Алдаа: ${error.message}`);
            return res.status(500).send('Имэйл илгээхэд алдаа гарлаа');
        }
        console.log(`Имэйл амжилттай илгээгдлээ: ${info.response}`);
        res.send('Имэйл амжилттай илгээгдлээ');
    });
});

// Серверээ ажиллуулах
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Сервер ${PORT} порт дээр ажиллаж байна`);
});

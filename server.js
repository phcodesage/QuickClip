const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { downloadAndConvert } = require('./scraper');

const app = express();
const PORT = 3002;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/favicon.ico', (req, res) => res.status(204));

app.post('/download', async (req, res) => {
    const { url, format } = req.body;
    try {
        const filePath = await downloadAndConvert(url, format);
        res.download(filePath, err => {
            if (err) {
                res.status(500).send({ error: 'Failed to download file' });
            }
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

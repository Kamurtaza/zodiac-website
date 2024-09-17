import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Middleware to parse JSON data from the frontend
app.use(express.json());

const API = 'iKndOeWIN919AV2GRY0L36f0Vp4MUbv56wNFG8Hg';


app.post('/getZodiacChart', async (req, res) => {
    const { birthDate } = req.body;
    const sunSign = calculateSunSign(new Date(birthDate));

    try {
        const apiUrl = `https://json.freeastrologyapi.com/`;
        const response = await fetch(apiUrl);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Find the zodiac data for the user's sun sign
        const zodiacData = data.find(z => z.name.toLowerCase() === sunSign.toLowerCase());

        if (zodiacData) {
            res.json(zodiacData);
        } else {
            res.status(404).json({ message: 'Zodiac sign not found' });
        }
    } catch (error) {
        console.error('Error fetching zodiac chart:', error);
        res.status(500).json({ message: 'Error fetching chart', error: error.message });
    }
});


// Function to calculate sun sign based on birth date
function calculateSunSign(birthDate) {
    const month = birthDate.getMonth() + 1;
    const day = birthDate.getDate();

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius';
    if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) return 'Capricorn';
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces';
}

app.listen(3000, () => console.log('Server running on port 3000'));

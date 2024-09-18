import express from 'express';
import fetch from 'node-fetch';

const app = express();

// Serve static files from the 'public' folder (index.html, styles.css, etc.)
app.use(express.static('public'));

// Middleware to parse JSON data from the frontend
app.use(express.json());

// API key (replace with your actual API key)
const API_KEY = '5e03fe829176a5d7f4fbb29d1b4439c4'; 

// Route to handle form submissions and fetch zodiac chart
app.post('/getZodiacChart', async (req, res) => {
    const { name, birthDate, city } = req.body;  // Extract name, birthDate, and city from the form data
    const birthDetails = new Date(birthDate);  // Convert birthDate to a JavaScript Date object

    try {
        // Extract day, month, year, hour, and minute from the birthDetails
        const day = birthDetails.getDate();
        const month = birthDetails.getMonth() + 1; // getMonth() returns 0-based index
        const year = birthDetails.getFullYear();
        const hour = birthDetails.getHours();
        const min = birthDetails.getMinutes();

        // API URL
        const apiUrl = 'https://hook.eu2.make.com/n2ghu1vhbute5k11rfncjxwk7qmrhbnh';

        // Make a POST request to the new API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: 'sam@example.com',  // You can also extract Email from the form if needed
                Name: name,
                Day: day.toString(),
                Month: month.toString(),
                Year: year.toString(),
                Hour: hour.toString(),
                Min: min.toString(),
                City: city,
                'x-api-key': API_KEY,  // Add the API key here
            }),
        });

        // Check if the API request was successful (status 200-299)
        if (!response.ok) {
            throw new Error(`API request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Send the Zodiac data back to the frontend
        res.json(data);

    } catch (error) {
        console.error('Error fetching zodiac chart:', error);
        res.status(500).json({ message: 'Error fetching chart', error: error.message });
    }
});

// Start the server on port 3000
app.listen(3000, () => console.log('Server running on port 3000'));

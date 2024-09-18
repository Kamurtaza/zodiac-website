document.getElementById('zodiacForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const birthDate = document.getElementById('birthDate').value;
    const city = document.getElementById('city').value;

    console.log('Form submitted');
    console.log('Name:', name, 'BirthDate:', birthDate, 'City:', city);

    try {
        const response = await fetch('/getZodiacChart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, birthDate, city }),
        });

        console.log('Response received');
        const result = await response.json();
        console.log('API Response:', result);

        displayZodiacList(result);  // Call the new function to display the list

    } catch (error) {
        console.error('Error fetching zodiac chart:', error);
    }
});

function displayZodiacList(data) {
    console.log('Displaying zodiac data as a list');

    const zodiacListContainer = document.getElementById('zodiacListContainer');
    zodiacListContainer.innerHTML = '';  // Clear any existing content

    const planetData = parseAstrologyData(data);  // Parse the astrology data
    console.log('Parsed planet data:', planetData);

    if (planetData.length === 0) {
        console.error('No data to display');
        return;
    }

    // Create a list element
    const ul = document.createElement('ul');

    planetData.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.planet}: ${item.degrees.toFixed(2)}°`;  // Display planet name and degrees
        ul.appendChild(li);
    });

    // Append the list to the container
    zodiacListContainer.appendChild(ul);
    console.log('Zodiac data displayed successfully');
}

// Updated function to parse planet data from the API response
function parseAstrologyData(data) {
    const planetData = [];
    const planets = data.split(';');  // Split the response by ';' to get each planet's data

    planets.forEach(planetString => {
        // Match the planet name and degree string (e.g., "Sun:Cancer, 8°52’05’’")
        const planetMatch = planetString.match(/^([^:]+):([^,]+),\s*(\d+)°(\d+)’(\d+)’’/);
        if (planetMatch) {
            const planetName = planetMatch[1].trim();  // Get the planet name (e.g., "Sun")
            const degrees = parseFloat(planetMatch[3]) + parseFloat(planetMatch[4]) / 60;  // Convert degree + minutes to decimal
            planetData.push({ planet: planetName, degrees });
        }
    });

    return planetData;
}

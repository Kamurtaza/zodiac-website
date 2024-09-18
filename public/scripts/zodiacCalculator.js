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

        displayZodiacList(result);  // Call the function to display the list

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
        // Display planet name, zodiac sign, degrees, house, and retrograde/direct status
        li.textContent = `${item.planet}: ${item.zodiacSign}, ${item.degrees.toFixed(2)}°, House ${item.house}, ${item.motion}`;
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
        // Match the planet name, zodiac sign, degrees, and house
        const planetMatch = planetString.match(/^([^:]+):([^,]+),\s*(\d+)°(\d+)’(\d+)’’,\s*House\s*(\d+),\s*(Direct|Retrograde)/);

        if (planetMatch) {
            const planetName = planetMatch[1].trim();  // Get the planet name (e.g., "Sun")
            const zodiacSign = planetMatch[2].trim();  // Get the zodiac sign (e.g., "Cancer")
            const degrees = parseFloat(planetMatch[3]) + parseFloat(planetMatch[4]) / 60;  // Convert degree + minutes to decimal
            const house = planetMatch[6].trim();  // Get the house number
            const motion = planetMatch[7].trim();  // Get Direct/Retrograde status

            planetData.push({ planet: planetName, zodiacSign, degrees, house, motion });
        }
    });

    return planetData;
}

document.getElementById('zodiacForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const birthDate = document.getElementById('birthDate').value;

    try {
        const response = await fetch('/getZodiacChart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ birthDate }),
        });

        const result = await response.json();
        displayChartResult(result);
    } catch (error) {
        console.error('Error fetching zodiac chart:', error);
    }
});

function displayChartResult(result) {
    const resultDiv = document.getElementById('chartResult');
    if (result.message) {
        resultDiv.innerHTML = `<p>${result.message}</p>`;
    } else {
        resultDiv.innerHTML = `
            <h2>${result.name} Zodiac Sign</h2>
            <p><strong>Date Range:</strong> ${result.date_range}</p>
            <p><strong>Traits:</strong> ${result.traits.join(', ')}</p>
            <p><strong>Compatibility:</strong> ${result.compatibility.join(', ')}</p>
            <p><strong>Lucky Numbers:</strong> ${result.lucky_numbers.join(', ')}</p>
        `;
    }
}

document.getElementById('translateBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value;
    chrome.runtime.sendMessage({ action: "translateAndDefine", word }, (response) => {
        document.getElementById('result').textContent = response.response;
    });
});

document.getElementById('speak').addEventListener('click', function() {
    const textToSpeak = "олегер, ті сучка ебана. Я тебе на хую вертел";
    const apiKey = '59ca0e8bdb75f0e44ef4da02d3f1c16f';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
        },
        body: JSON.stringify({
            text: textToSpeak,
            voice_settings: {
                stability: 1.0,
                similarity_boost: 1.0,
                style: 0.5,
                use_speaker_boost: true
            }
        })
    };

    fetch('https://api.elevenlabs.io/v1/text-to-speech/RzI0GdCJKAD9xMkuY0j8', options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();  // Get the response as a Blob if it's binary data
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);
            audio.play();
        })
        .catch(err => console.error('Error:', err));
});
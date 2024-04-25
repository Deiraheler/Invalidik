
let translateButton = createTranslateButton();
let blockInfo = createBlockInfo();
let returnText = "";

document.addEventListener('mouseup', () => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length) {
        updateButtonAndBlockPositions(translateButton, blockInfo);
        translateButton.style.display = 'block';
    } else {
        translateButton.style.display = 'none';
        blockInfo.style.display = 'none';
    }
});

attachTranslateButtonListener(translateButton, blockInfo);

function createTranslateButton() {
    let button = document.createElement('button');
    button.id = 'translateButton';
    button.textContent = 'What is it?';
    button.style.position = 'absolute';
    button.style.zIndex = '1000';
    document.body.appendChild(button);
    return button;
}

function createBlockInfo() {
    let block = document.createElement('div');
    block.id = 'blockInfo';
    block.style = "position: absolute; z-index: 1000; background-color: white; border: 1px solid blue; padding: 10px; border-radius: 5px; max-width: 300px; color: black; display: none;";
    document.body.appendChild(block);
    let blockInfoText = document.createElement('p');
    blockInfoText.innerText = 'Loading...';
    block.appendChild(blockInfoText);

    // Now renderHTML uses a callback to ensure the HTML is loaded before accessing elements
    renderHTML(chrome.runtime.getURL('wordinfo.html'), 'blockInfo', function() {
        let speakerBlock = document.getElementById("speaker-img");
        if (speakerBlock) {
            speakerBlock.addEventListener('click', function() {
                speakText(returnText);  // Make sure returnText is defined and accessible
            });
        } else {
            console.log('Speaker image not found after loading HTML.');
        }
    });

    return block;
}

function renderHTML(url, targetId, callback) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.innerHTML = html;
                callback();  // Execute callback after HTML is loaded
            } else {
                console.error('Element with ID ' + targetId + ' not found.');
            }
        })
        .catch(error => {
            console.error('Error fetching HTML:', error);
        });
}

function updateButtonAndBlockPositions(button, block) {
    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();
    button.style.top = `${window.scrollY + rect.top - 40}px`;
    button.style.left = `${window.scrollX + rect.left}px`;
    block.style.top = `${window.scrollY + rect.top + 20}px`;
    block.style.left = `${window.scrollX + rect.left}px`;
}

function attachTranslateButtonListener(button, block) {
    if (!button.dataset.listenerAttached) {
        console.log('Attaching listener to translate button');
        button.addEventListener('click', () => {
            let selectedText = window.getSelection().toString().trim();
            if (selectedText.length) {
                chrome.runtime.sendMessage({action: "translateAndDefine", word: selectedText}, (response) => {
                    let blockInfoText = block.querySelector('p');
                    returnText = response.response;
                    blockInfoText.innerHTML = response.response;
                    block.style.display = 'block';
                });
            }
        });
        button.dataset.listenerAttached = "true";
    }
}

document.getElementById('speak').addEventListener('click', function() {
    // Тут викликаємо функцію, яка озвучить текст
    speakText(lastReceivedText);
});

function speakText(text) {
    const textToSpeak = text;
    const apiKey = 'YOUR_API_KEY';

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey
        },
        body: JSON.stringify({
            text: textToSpeak,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 1.0,
                similarity_boost: 0.1,
                style: 0.0,
                use_speaker_boost: false
            }
        })
    };

    fetch('https://api.elevenlabs.io/v1/text-to-speech/IydADtdlAIW1uYFuceGd', options)
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
}
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translateAndDefine") {
        const word = request.word;
        const apiKey = 'sk-proj-9pduhKY2PdxDkQVtWUa0T3BlbkFJ1VRqwPII8kHkjxYEOv5i';

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Use the GPT-3.5 Turbo model for this request
                messages: [{
                    role: "user",
                    content: `For the English word '${word}', please provide the following in Ukrainian, with the specified HTML styling:
- The word itself should be in English and styled with a font size of 20px.
- A phonetic transcription using Ukrainian characters on how to read the English word, styled with a font size of 14px.
- The translation of the word into Ukrainian.
- A definition in Ukrainian.
- The meaning or use of the word in a Ukrainian sentence or context.

The format should be as follows (with each label in bold):
<span style="font-size:20px;"><strong>${word}</strong></span><br>
<strong>Транскрипція:</strong> <span style="font-size:14px;">[Your transcription here in Ukrainian characters]</span><br>
<strong>Переклад:</strong> <span style="font-size:14px;">Your translation here in Ukrainian</span><br>
<strong>Визначення:</strong> <span style="font-size:14px;">Your definition here in Ukrainian</span><br>
<strong>Значення:</strong> <span style="font-size:14px;">Your sentence or context here in Ukrainian</span>
`
                }]
            })
        })
            .then(response => {
                if (!response.ok) {
                    // If the HTTP response is not ok, throw an error to go to the catch block
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.choices && data.choices.length > 0 && data.choices[0].message.content.trim() !== '') {
                    sendResponse({ response: data.choices[0].message.content });
                } else {
                    sendResponse({ response: "No translation found. Please try another word." });
                }
            })
            .catch(error => {
                console.error('Error calling OpenAI API:', error);
                sendResponse({ response: "Failed to get response from API: " + error.message });
            });
        return true;  // Keeps the message channel open for the asynchronous response
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "translateAndDefine") {
        const word = request.word;
        const apiKey = 'sk-proj-zJe2JF6GDRL7MQHo9gxvT3BlbkFJrrNnDvdBPBsSKWXEY70l'; // Replace with your actual OpenAI API key

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", // Specify GPT-3.5 Turbo model
                messages: [{
                    role: "system",
                    content: "Translate English words to Ukrainian and provide their definitions in English."
                }, {
                    role: "user",
                    content: `Translate the word '${word}' to Ukrainian and define it in English.`
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

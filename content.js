document.addEventListener('mouseup', () => {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length) {
        // Create a new button or find the existing one
        let translateButton = document.getElementById('translateButton');
        if (!translateButton) {
            translateButton = document.createElement('button');
            translateButton.id = 'translateButton';
            translateButton.textContent = 'What is it?';
            translateButton.style.position = 'absolute';
            translateButton.style.zIndex = '1000';
            document.body.appendChild(translateButton);
        }

        // Place the button near the selection
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        translateButton.style.top = `${window.scrollY + rect.top - 40}px`; // Adjust as necessary
        translateButton.style.left = `${window.scrollX + rect.left}px`; // Adjust as necessary
        translateButton.style.display = 'block';

        // Add event listener to the button
        translateButton.onclick = function () {
            // Send the word to the background.js for processing
            chrome.runtime.sendMessage({ action: "translateAndDefine", word: selectedText }, (response) => {
                alert(response.response); // Or you can display the response in another way
            });
        };
    } else {
        // Hide the button if no text is selected
        let translateButton = document.getElementById('translateButton');
        if (translateButton) {
            translateButton.style.display = 'none';
        }
    }
});

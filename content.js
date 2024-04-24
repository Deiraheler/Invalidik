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

        let blockInfo = document.getElementById('blockInfo');
        let blockInfoText = document.createElement('p');
        blockInfoText.innerText = 'Loading...';
        if(!blockInfo){
            blockInfo = document.createElement('div');
            blockInfo.id = 'blockInfo';
            blockInfo.style.position = 'absolute';
            blockInfo.style.zIndex = '1000';
            blockInfo.style.backgroundColor = 'white';
            blockInfo.style.border = '1px solid blue';
            blockInfo.style.padding = '10px';
            blockInfo.style.borderRadius = '5px';
            blockInfo.style.maxWidth = '300px';
            blockInfo.style.color = 'black';

            //Inside text block
            blockInfo.appendChild(blockInfoText);
        }

        // Place the button near the selection
        const range = window.getSelection().getRangeAt(0);
        const rect = range.getBoundingClientRect();
        translateButton.style.top = `${window.scrollY + rect.top - 40}px`; // Adjust as necessary
        translateButton.style.left = `${window.scrollX + rect.left}px`; // Adjust as necessary
        translateButton.style.display = 'block';

        blockInfo.style.top = `${window.scrollY + rect.top + 20}px`; // Adjust as necessary
        blockInfo.style.left = `${window.scrollX + rect.left}px`; // Adjust as necessary


        if (!translateButton.dataset.listenerAttached) {
            // Add event listener to the button
            translateButton.addEventListener('click', () => {
                selectedText = window.getSelection().toString().trim();
                chrome.runtime.sendMessage({ action: "translateAndDefine", word: selectedText }, (response) => {
                    //Changing text of blockInfoText
                    blockInfoText.innerHTML = response.response;
                    translateButton.parentNode.appendChild(blockInfo);
                    blockInfo.style.display = 'block';
                });
            });
            // Set flag to indicate listener is attached
            translateButton.dataset.listenerAttached = true;
        }
    } else {
        // Hide the button if no text is selected
        let translateButton = document.getElementById('translateButton');
        let blockInfo = document.getElementById('blockInfo');
        if (translateButton) {
            translateButton.style.display = 'none';
            blockInfo.style.display = 'none';
        }
    }
});

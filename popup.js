document.getElementById('translateBtn').addEventListener('click', () => {
    const word = document.getElementById('wordInput').value;
    chrome.runtime.sendMessage({ action: "translateAndDefine", word }, (response) => {
        document.getElementById('result').textContent = response.response;
    });
});


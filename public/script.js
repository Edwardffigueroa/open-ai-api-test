const API_BASE_URL = 'http://localhost:5000';

// Chat Completion Function
async function getChatCompletion() {
    const input = document.getElementById('chatInput').value.trim();
    const resultDiv = document.getElementById('chatResult');

    if (!input) {
        resultDiv.innerHTML = '<p class="error">Please enter a question</p>';
        return;
    }

    const button = event.target;
    button.disabled = true;
    resultDiv.innerHTML = '<p class="loading">Thinking...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/chat-completion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <h3>Response:</h3>
                <pre>${data.text}</pre>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        button.disabled = false;
    }
}

// Image Generation Function
async function generateImage() {
    const prompt = document.getElementById('imagePrompt').value.trim();
    const resultDiv = document.getElementById('imageResult');

    if (!prompt) {
        resultDiv.innerHTML = '<p class="error">Please enter an image description</p>';
        return;
    }

    const button = event.target;
    button.disabled = true;
    resultDiv.innerHTML = '<p class="loading">Generating image...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/generate-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (response.ok) {
            const imageUrl = data.data[0].url;
            resultDiv.innerHTML = `
                <h3>Generated Image:</h3>
                <img src="${imageUrl}" alt="Generated image">
                <p><a href="${imageUrl}" target="_blank">Open in new tab</a></p>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        button.disabled = false;
    }
}

// Text-to-Speech Function
async function textToSpeech() {
    const prompt = document.getElementById('ttsInput').value.trim();
    const resultDiv = document.getElementById('ttsResult');

    if (!prompt) {
        resultDiv.innerHTML = '<p class="error">Please enter text to convert</p>';
        return;
    }

    const button = event.target;
    button.disabled = true;
    resultDiv.innerHTML = '<p class="loading">Converting to speech...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/text-to-speech`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <p class="success">${data.status}</p>
                <audio controls src="${data.audioUrl}?t=${Date.now()}">
                    Your browser does not support the audio element.
                </audio>
            `;
        } else {
            resultDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        button.disabled = false;
    }
}

// Allow Enter key to submit in textareas
document.addEventListener('DOMContentLoaded', () => {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                const button = textarea.parentElement.querySelector('button');
                button.click();
            }
        });
    });
});
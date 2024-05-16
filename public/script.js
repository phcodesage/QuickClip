document.getElementById('format').addEventListener('change', function () {
    const resolutionSection = document.getElementById('resolutionSection');
    const resolutionButton = document.getElementById('resolutionButton');
    if (this.value === 'mp3') {
        resolutionSection.classList.add('hidden');
    } else {
        resolutionSection.classList.remove('hidden');
    }
});

// Toggle resolution menu
document.getElementById('resolutionButton').addEventListener('click', function () {
    document.getElementById('resolutionMenu').classList.toggle('hidden');
});

// Enable/disable download button based on URL input
document.getElementById('url').addEventListener('input', function () {
    const downloadButton = document.getElementById('downloadButton');
    if (this.value.trim() === '') {
        downloadButton.disabled = true;
    } else {
        downloadButton.disabled = false;
    }
});

function startDownload() {
    const url = document.getElementById('url').value;
    const format = document.getElementById('format').value;
    const progressElement = document.getElementById('progress');
    progressElement.textContent = 'Downloading...';

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format })
    }).then(response => {
        if (!response.ok) throw new Error('Failed to download.');
        return response.blob();
    }).then(blob => {
        progressElement.textContent = 'Download complete!';
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = `downloaded_file.${format}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(blobUrl);
    }).catch(error => {
        progressElement.textContent = error.message;
    });
}

// Attach the startDownload function to the download button
document.getElementById('downloadButton').addEventListener('click', startDownload);

// Initial check to hide resolution if the default format is audio
document.getElementById('format').dispatchEvent(new Event('change'));
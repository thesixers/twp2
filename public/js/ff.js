const fileInput = document.getElementById('fileInput');
const progressBar = document.getElementById('progressBar');

fileInput.addEventListener('change', async () => {
  const file = fileInput.files[0];

  if (file) {
    const formData = new FormData();
    formData.append('file', file);

    const controller = new AbortController();
    const signal = controller.signal;

    try {
      const response = await fetch('/upload', { 
        method: 'POST',
        body: formData,
        signal: signal
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.text(); // Or response.json()
      console.log('Upload successful:', data);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Upload aborted');
      } else {
        console.error('Upload failed:', error);
      }
    } finally {
      fileInput.removeEventListener('progress', uploadProgress);
    }

    const uploadProgress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        progressBar.style.width = `${percentComplete.toFixed(2)}%`; // Display with 2 decimal places
        // Optionally, display the progress percentage in the progress bar itself
        progressBar.textContent = `${percentComplete.toFixed(2)}%`; 
      }
    };

    fileInput.addEventListener('progress', uploadProgress); 
  }
});


document.getElementById('imageInput').addEventListener('change', handleImage, false);
function handleImage(e) {
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            processImage(ctx, canvas);
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function processImage(ctx, canvas) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Convert to grayscale
    for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
    }

    // Apply thresholding
    const threshold = 128;
    for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i];
        const value = brightness >= threshold ? 255 : 0;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);

    recognizeSymbols(canvas);
}

function recognizeSymbols(canvas) {
    Tesseract.recognize(
        canvas,
        'eng',
        {
            logger: m => console.log(m)
        }
    ).then(({ data: { text } }) => {
        document.getElementById('outputText').innerText = text;
    });
}
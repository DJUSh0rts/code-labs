document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function() {
                const canvas = document.getElementById("canvas");
                const ctx = canvas.getContext("2d");

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                

                for (let i = 0; i < img.height; i++){
                    for (let j = 0; j < img.width; j++){
                        // Get pixel data
                        const imageData = ctx.getImageData(0, 0, img.width, img.height);
                        console.log("Pixel Data:", imageData.data); // This is a Uint8ClampedArray

                        // Example: Get color of the first pixel
                        const red = imageData.data[0];
                        const green = imageData.data[1];
                        const blue = imageData.data[2];
                        const alpha = imageData.data[3];
        
                        console.log(`First pixel color: R=${red}, G=${green}, B=${blue}, A=${alpha}`);
                    }
                }
                
                
            };
        };

        reader.readAsDataURL(file);
    }
});

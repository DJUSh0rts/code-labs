let ColourScheme = [
    ["0", 0,0,0,0],
    ["1", 14,15,12,255]
]


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
                        const imageData = ctx.getImageData(j, i, img.width, img.height).data;

                        console.log(FindClosestMakeCodeColour(imageData));
                    }
                }
                
                
            };
        };

        reader.readAsDataURL(file);
    }
});

function FindClosestMakeCodeColour(){
    let bestMatch = "";
    let minDistance = Double.MAX_VALUE;

    for (let i = 0; i < ColourScheme.length; i++){
        let distance = ColourDistance(ColourScheme[i]);
        if(distance < minDistance){
            minDistance = distance;
            bestMatch = ColourScheme[i][0];
        }
    }

    return bestMatch;
}

function ColourDistance(c1, c2){
    let aDiff = c1.A - c2[1];
    let rDiff = c1.R - c2[2];
    let gDiff = c1.G - c2[3];
    let bDiff = c1.B - c2[4];

    return Math.sqrt(Math.pow(aDiff) + Math.pow(rDiff) + Math.pow(gDiff) + Math.pow(bDiff) +);
}


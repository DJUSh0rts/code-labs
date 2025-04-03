let ColourScheme = [
    ["0", 0,0,0,0],
    ["1", 255, 255, 255, 255],
    ["2", 255, 255, 33, 33],
    ["3", 255, 255, 147, 196],
    ["4", 255, 255, 129, 53],
    ["5", 255, 255, 246, 9],
    ["6", 255, 36, 156, 163],
    ["7", 255, 120, 220, 82],
    ["8", 255, 142, 46, 196],
    ["9", 255, 135, 242, 255],
    ["a", 255, 142, 46, 196],
    ["b", 255, 164, 131, 159],
    ["c", 255, 92, 64, 108],
    ["d", 255, 229, 205, 196],
    ["e", 255, 145, 70, 61],
    ["f", 255, 0, 0, 0]
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

function FindClosestMakeCodeColour(colour){
    let bestMatch = "";
    let minDistance = Number.MAX_VALUE;

    for (let i = 0; i < ColourScheme.length; i++){
        let distance = ColourDistance(colour, ColourScheme[i]);
        if(distance < minDistance){
            minDistance = distance;
            bestMatch = ColourScheme[i][0];
        }
    }

    return bestMatch;
}

function ColourDistance(c1, c2){
    let aDiff = c1[3] - c2[1];
    let rDiff = c1[0] - c2[2];
    let gDiff = c1[1] - c2[3];
    let bDiff = c1[2] - c2[4];

    return Math.sqrt(Math.pow(aDiff) + Math.pow(rDiff) + Math.pow(gDiff) + Math.pow(bDiff));
}


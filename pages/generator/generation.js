let ColourSchemes = [
    [ "Arcade",
        ["0", 0,0,0,0],
        ["1", 255, 255, 255, 255],
        ["2", 255, 255, 33, 33],
        ["3", 255, 255, 147, 196],
        ["4", 255, 255, 129, 53],
        ["5", 255, 255, 246, 9],
        ["6", 255, 36, 156, 163],
        ["7", 255, 120, 220, 82],
        ["8", 255, 0, 63, 173],
        ["9", 255, 135, 242, 255],
        ["a", 255, 142, 46, 196],
        ["b", 255, 164, 131, 159],
        ["c", 255, 92, 64, 108],
        ["d", 255, 229, 205, 196],
        ["e", 255, 145, 70, 61],
        ["f", 255, 0, 0, 0]
    ],
    
    [ "Matte",
        ["0", 0,0,0,0],
        ["1", 255, 255, 241, 232],
        ["2", 255, 255, 0, 77],
        ["3", 255, 255, 119, 168],
        ["4", 255, 255, 163, 0],
        ["5", 255, 255, 236, 39],
        ["6", 255, 0, 135, 81],
        ["7", 255, 0, 228, 54],
        ["8", 255, 41, 173, 255],
        ["9", 255, 194, 195, 199],
        ["a", 255, 126, 37, 83],
        ["b", 255, 131, 118, 156],
        ["c", 255, 95, 87, 79],
        ["d", 255, 255, 204, 170],
        ["e", 255, 171, 82, 54],
        ["f", 255, 29, 43, 83]
    ],
    
        [ "Grayscale",
            ["0", 0,0,0,0],
            ["1", 255, 255, 255, 255],
            ["2", 255, 237, 237, 237],
            ["3", 255, 219, 219, 219],
            ["4", 255, 200, 200, 200],
            ["5", 255, 182, 182, 182],
            ["6", 255, 164, 164, 164],
            ["7", 255, 146, 146, 146],
            ["8", 255, 128, 128, 128],
            ["9", 255, 109, 109, 109],
            ["a", 255, 91, 91, 91],
            ["b", 255, 73, 73, 73],
            ["c", 255, 55, 55, 55],
            ["d", 255, 36, 36, 36],
            ["e", 255, 18, 18, 18],
            ["f", 255, 0, 0, 0]
    ],
    
    [ "Pastel",
        ["0", 0,0,0,0],
        ["1", 255, 255, 247, 228],
        ["2", 255, 249, 130, 132],
        ["3", 255, 254, 170, 228],
        ["4", 255, 255, 195, 132],
        ["5", 255, 255, 247, 160],
        ["6", 255, 135, 168, 137],
        ["7", 255, 176, 235, 147],
        ["8", 255, 176, 169, 228],
        ["9", 255, 172, 204, 228],
        ["a", 255, 179, 227, 218],
        ["b", 255, 217, 200, 191],
        ["c", 255, 108, 86, 113],
        ["d", 255, 255, 130, 198],
        ["e", 255, 222, 163, 139],
        ["f", 255, 40, 40, 46]
    ]
]
    let currentScheme = ColourSchemes[0];



    self.onmessage = function(e) {
        if (e.data.type === "process") {
            const imageData = e.data.imageData.data;
            const width = e.data.width;
            const height = e.data.height;

            let textOut = "";

            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    const index = (i * width + j) * 4;
                    const colour = [
                        imageData[index],     // R
                        imageData[index + 1], // G
                        imageData[index + 2], // B
                        imageData[index + 3]  // A
                    ];
                    textOut += FindClosestMakeCodeColour(colour);
                }
                textOut += "\n";
            }

            self.postMessage({
                type: "done",
                result: textOut
            });

        }
    }




    function FindClosestMakeCodeColour(colour){
        let bestMatch = "";
        let minDistance = Number.MAX_VALUE;

        for (let i = 1; i < currentScheme.length; i++){
            let distance = ColourDistance(colour, currentScheme[i]);
            if(distance < minDistance){
                minDistance = distance;
                bestMatch = currentScheme[i][0];
            }
        }

        return bestMatch;
    }

    function ColourDistance(c1, c2){
        let aDiff = c1[3] - c2[1];
        let rDiff = c1[0] - c2[2];
        let gDiff = c1[1] - c2[3];
        let bDiff = c1[2] - c2[4];

        return Math.sqrt(Math.pow(aDiff,2) + Math.pow(rDiff,2) + Math.pow(gDiff,2) + Math.pow(bDiff,2));
    }
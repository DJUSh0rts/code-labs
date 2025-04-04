let currentScheme;


    self.onmessage = function(e) {
        if (e.data.type === "process") {
            const imageData = e.data.imageData.data;
            currentScheme = e.data.colourScheme;
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
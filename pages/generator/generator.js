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


let worker = new Worker("pages/generator/generation.js");
let file;
let textOut

// Function to populate the dropdown with color schemes
function populateDropdown() {
    const selector = document.getElementById("colorPaletteSelector");
    
    ColourSchemes.forEach(scheme => {
        // Add the scheme name as an option
        const option = document.createElement("option");
        option.value = scheme[0]; // Set the value to the name of the color scheme (e.g., "Normal")
        option.innerText = scheme[0]; // Display the name of the color scheme in the dropdown
        selector.appendChild(option);
    });
}

// Function to update the color preview based on the selected palette
function updatePalette() {
    const selectedSchemeName = document.getElementById("colorPaletteSelector").value;
    const selectedScheme = ColourSchemes.find(scheme => scheme[0] === selectedSchemeName);
    currentScheme = selectedScheme;
    
    if (selectedScheme) {
        const previewContainer = document.getElementById("colorPreview");
        previewContainer.innerHTML = "";  // Clear previous preview

        // Loop through the colors in the selected palette (skip the first element as it's the scheme name)
        for (let i = 1; i < selectedScheme.length; i++) {
            const color = selectedScheme[i]; // Each entry is an array like ["1", 255, 255, 255, 255]
            const colorBlock = document.createElement("div");
            colorBlock.classList.add("colorBlock");
            colorBlock.style.backgroundColor = `rgb(${color[2]}, ${color[3]}, ${color[4]})`; // RGB format
            previewContainer.appendChild(colorBlock);
        }
    }
}

// Initialize the page by populating the dropdown and showing the first palette by default
window.onload = function() {
    populateDropdown();
    updatePalette(); // Show the default color palette
};

document.getElementById("imageInput").addEventListener("change", function(event) {
    file = event.target.files[0];
});

function Generate(){
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

                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    // Send data to worker
                    worker.postMessage({
                        type: "process",
                        imageData: imageData,
                        colourScheme: currentScheme,
                        width: img.width,
                        height: img.height
                    });

		
            };
        };

        reader.readAsDataURL(file);
    }
}

worker.onmessage = function(e) {
    if (e.data.type === "done") {
        textOut = e.data.result;
        document.getElementById("output").innerText = e.data.result;
    }
};



document.getElementById("hideOutPut").addEventListener("change", function () {
    if (this.checked) {
        document.getElementById("output").style.display = "none";
    } else {
        document.getElementById("output").style.display = "inline-block";
    }
});

document.getElementById("copyButton").addEventListener("click", function () {
    const textToCopy = textOut;

    navigator.clipboard.writeText(textToCopy).then(() => {
        alert("Text copied: " + textToCopy);
    }).catch(err => {
        console.error("Failed to copy text: ", err);
    });
});
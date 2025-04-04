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
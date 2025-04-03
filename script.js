document.getElementById("imageInput").addEventListener("change", function(event) {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imageUrl = e.target.result; // Get the data URL
            document.getElementById("preview").src = imageUrl; // Display the image
            document.getElementById("preview").style.display = "block";
            
            // You can now use `imageUrl` in your JavaScript code
            console.log("Image URL:", imageUrl);
        };

        reader.readAsDataURL(file); // Convert file to data URL
    }
});

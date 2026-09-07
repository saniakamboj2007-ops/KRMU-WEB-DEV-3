const fs = require("fs");

const fileName = "sample.txt";

// CREATE FILE
fs.writeFile(fileName, "Hello, this is my first file.", (err) => {

    if (err) {
        console.log("Error creating file:", err.message);
        return;
    }

    console.log("File created successfully.");

    // READ FILE
    fs.readFile(fileName, "utf8", (err, data) => {

        if (err) {
            console.log("Error reading file:", err.message);
            return;
        }

        console.log("File content:", data);

        // UPDATE FILE
        fs.appendFile(fileName, "\nThis is updated content.", (err) => {

            if (err) {
                console.log("Error updating file:", err.message);
                return;
            }

            console.log("File updated successfully.");

            // DELETE FILE
            fs.unlink(fileName, (err) => {

                if (err) {
                    console.log("Error deleting file:", err.message);
                    return;
                }

                console.log("File deleted successfully.");
            });
        });
    });
});
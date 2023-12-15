const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

// Set up multer
const upload = multer();

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Serve HTML form for file upload
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Access the uploaded file using req.file
    const uploadedFile = req.file;

    // Check if a file was uploaded
    if (!uploadedFile) {
      return res.status(400).send('No file uploaded.');
    }

    // Write the uploaded file to a temporary .tex file
    const tempFilePath = __dirname + '/temp.tex';
    fs.writeFileSync(tempFilePath, uploadedFile.buffer);

    // Run xelatex to convert .tex to .pdf
    const command = `xelatex -output-directory=${__dirname} ${tempFilePath}`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running xelatex: ${error.message}`);
        return res.status(500).send('Error converting .tex to .pdf.');
      }

      // Read the generated .pdf file
      const pdfFilePath = tempFilePath.replace('.tex', '.pdf');
      const pdfFile = fs.readFileSync(pdfFilePath);

      // Send the generated .pdf file in the response
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=output.pdf');
      res.send(pdfFile);

      // Cleanup: Delete temporary files
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(pdfFilePath);
    });
  } catch (err) {
    console.error(`Error processing file upload: ${err.message}`);
    res.status(500).send('Internal Server Error.');
  }
});

// For Cloud Run, listen on the PORT environment variable
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down gracefully...');
  server.close(() => {
    console.log('Server has been gracefully terminated');
  });
});

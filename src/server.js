const app = require("./app");
const PORT = process.env.PORT || 8095;

// Lidhim routes për PDF
const pdfRoutes = require("./routes/pdf.routes"); 
app.use("/api/pdf", pdfRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

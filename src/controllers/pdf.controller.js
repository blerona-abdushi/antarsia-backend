const PDFDocument = require("pdfkit");
const pool = require("../config/db");

// PDF për të gjithë antarët
exports.generateAllMembersPDF = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM members ORDER BY emri ASC, mbiemri ASC");

        const doc = new PDFDocument({ margin: 30, size: "A4" });

        // Set headers për download
        res.setHeader("Content-Disposition", "attachment; filename=members.pdf");
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        // Title
        doc.fontSize(18).text("Lista e Antarve", { align: "center" });
        doc.moveDown();

        // Column settings
        const tableTop = 100;
        const itemHeight = 25;

        const columns = [
            { header: "ID", width: 40 },
            { header: "Emri Mbiemri", width: 150 },
            { header: "Kat.", width: 50 },
            { header: "Viti", width: 70 },
            { header: "Rryma", width: 70 },
            { header: "Varreza", width: 70 },
            { header: "Ekstra", width: 70 },
        ];

        // Draw headers
        let x = doc.page.margins.left;
        columns.forEach(col => {
            doc.fontSize(12).text(col.header, x, tableTop, { width: col.width, align: "center" });
            x += col.width;
        });

        // Draw rows
        let y = tableTop + itemHeight;
        result.rows.forEach(m => {
            x = doc.page.margins.left;

            const rowValues = [
                m.id,
                `${m.emri} ${m.mbiemri}`,
                m.kategoria_pageses,
                m.viti_pageses,
                `${m.pagesa_rymes} den.`,
                `${m.fondi_varrezave} den.`,
                `${m.fondi_xhamine} den.`
            ];

            rowValues.forEach((val, i) => {
                doc.text(val, x, y, { width: columns[i].width, align: "center" });
                x += columns[i].width;
            });

            doc.moveTo(doc.page.margins.left, y + itemHeight - 5)
                .lineTo(doc.page.width - doc.page.margins.right, y + itemHeight - 5)
                .strokeColor("#aaaaaa")
                .lineWidth(0.5)
                .stroke();

            y += itemHeight;
        });

        doc.end();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating PDF" });
    }
};

// PDF për 1 antar
exports.generateMemberPDF = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("SELECT * FROM members WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Member not found" });
        }

        const m = result.rows[0];
        const doc = new PDFDocument({ margin: 30, size: "A4" });

        res.setHeader("Content-Disposition", `attachment; filename=member-${m.id}.pdf`);
        res.setHeader("Content-Type", "application/pdf");
        doc.pipe(res);

        doc.fontSize(18).text(`Member: ${m.emri} ${m.mbiemri}`, { align: "center" });
        doc.moveDown();

        doc.fontSize(14).text(`Kat: ${m.kategoria_pageses}`);
        doc.text(`Viti: ${m.viti_pageses}`);
        doc.text(`Rryma: ${m.pagesa_rymes}`);
        doc.text(`Fondi varrezave: ${m.fondi_varrezave}`);
        doc.text(`Fondi xhamine: ${m.fondi_xhamine}`);

        doc.end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating member PDF" });
    }
};

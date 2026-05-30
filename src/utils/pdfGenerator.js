throw new Error("PDF GENERATOR FILE LOADED");

const { PDFDocument, StandardFonts } = require("pdf-lib");

async function generateTripPDF(savedTrip) {
  const pdfDoc = await PDFDocument.create();

  let page = pdfDoc.addPage([600, 800]);

  const font = await pdfDoc.embedFont(
    StandardFonts.Helvetica
  );

  let y = 760;

  const drawLine = (text, size = 10, x = 50) => {
    if (y < 50) {
      page = pdfDoc.addPage([600, 800]);
      y = 760;
    }

    page.drawText(String(text).replace(/₹/g, "INR "), {
      x,
      y,
      size,
      font,
    });

    y -= size + 8;
  };

  drawLine(`Destination: ${savedTrip.destination}`, 18);
  drawLine(`Days: ${savedTrip.days}`, 12);
  drawLine(`Budget: INR ${savedTrip.budget}`, 12);
  drawLine(`Interest: ${savedTrip.interest}`, 12);

  y -= 10;

  drawLine("TRIP ITINERARY", 16);

  const plan = savedTrip.tripPlan || {};

  // Case 1: itinerary array exists
  if (
    Array.isArray(plan.itinerary) &&
    plan.itinerary.length > 0
  ) {
    for (const day of plan.itinerary) {
      drawLine(`Day ${day.day}`, 14);

      const content = String(
        day.content || ""
      ).replace(/₹/g, "INR ");

      const lines = content.split("\n");

      for (const line of lines) {
        if (line.trim()) {
          drawLine(line, 10, 70);
        }
      }

      y -= 10;
    }
  }
  // Case 2: tripPlan is plain text
  else if (typeof plan.tripPlan === "string") {
    const lines = plan.tripPlan
      .replace(/₹/g, "INR ")
      .split("\n");

    for (const line of lines) {
      if (line.trim()) {
        drawLine(line);
      }
    }
  }
  // Case 3: fallback
  else {
    drawLine("No itinerary found.");
    drawLine(JSON.stringify(plan, null, 2));
  }

  const pdfBytes = await pdfDoc.save();

  return Buffer.from(pdfBytes);
}

module.exports = {
  generateTripPDF,
};
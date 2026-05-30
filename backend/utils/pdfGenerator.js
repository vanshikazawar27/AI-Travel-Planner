const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

/**
 * Generates a PDF buffer containing the itinerary details of a saved trip.
 * @param {Object} savedTrip - Mongoose document (or plain object) representing a saved trip.
 * @returns {Promise<Buffer>} - PDF data as a Buffer suitable for sending in an HTTP response.
 */
async function generateTripPDF(savedTrip) {
  console.log('[pdfGenerator] generateTripPDF called', {
    destination: savedTrip?.destination,
    budget: savedTrip?.budget,
    days: savedTrip?.days,
    hasTripPlan: !!savedTrip?.tripPlan,
    tripPlanType: typeof savedTrip?.tripPlan,
  });

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { height } = page.getSize();

  // WinAnsi standard fonts can't encode some Unicode (like ₹). We sanitize all text we draw.
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const margin = 50;
  let y = height - margin;
  const lineHeight = 20;

  const safeText = (val) => {
    const str = String(val ?? '');
    return str
      .replace(/₹/g, 'INR')
      .replace(/[\u0000-\u001f]/g, '');
  };

  const drawText = (text, opts = {}) => {
    const { size = 12, color = rgb(0, 0, 0), fontRef = font } = opts;

    page.drawText(safeText(text), {
      x: margin,
      y,
      size,
      font: fontRef,
      color,
    });

    y -= lineHeight;
  };

  // Header
  drawText('Trip Itinerary', {
    size: 18,
    fontRef: fontBold,
    color: rgb(0.2, 0.4, 0.6),
  });
  y -= 10;

  // Basic info
  drawText(`Destination: ${savedTrip?.destination || ''}`);
  drawText(`Budget: ${savedTrip?.budget ?? ''}`);
  drawText(`Days: ${savedTrip?.days || ''}`);
  drawText(`Interests: ${savedTrip?.interest || ''}`);
  y -= 10;

  // Render tripPlan when it's a structured object
  if (savedTrip?.tripPlan && typeof savedTrip.tripPlan === 'object') {
    drawText('Trip Plan:', { fontRef: fontBold });

    const plan = savedTrip.tripPlan;
    for (const dayKey of Object.keys(plan)) {
      drawText(`Day ${dayKey}:`, { fontRef: fontBold });

      const activities = plan[dayKey];
      if (Array.isArray(activities)) {
        for (const act of activities) {
          const line = typeof act === 'string' ? act : JSON.stringify(act);
          drawText(`- ${line}`);
        }
      } else {
        drawText(`- ${JSON.stringify(activities)}`);
      }
    }
  }

  // Footer timestamp
  const now = new Date().toLocaleString();
  page.drawText(`Generated on ${now}`, {
    x: margin,
    y: margin / 2,
    size: 9,
    font,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}

module.exports = { generateTripPDF };


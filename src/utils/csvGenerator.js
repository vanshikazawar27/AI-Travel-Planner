async function generateTripCSV(savedTrip) {
  return `
Destination,${savedTrip.destination}
Days,${savedTrip.days}
Budget,${savedTrip.budget}
Interest,${savedTrip.interest}
`;
}

module.exports = {
  generateTripCSV,
};
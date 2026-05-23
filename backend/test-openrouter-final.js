async function testRoute() {
  try {
    const response = await fetch("http://localhost:5000/api/trip/generate-trip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        destination: "Manali",
        budget: "25000",
        days: "10",
        interest: "Adventure"
      })
    });
    const data = await response.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

testRoute();

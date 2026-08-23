async function testProdLogin() {
  console.log("Sending POST request for srujanhiremath519@gmail.com ...");
  try {
    const res = await fetch("https://shopkart-e-commerce.vercel.app/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "srujanhiremath519@gmail.com", password: "admin1234" }),
    });

    console.log("Response Status:", res.status, res.statusText);
    const text = await res.text();
    console.log("Response Body:", text);
  } catch (err) {
    console.error("Fetch Error:", err);
  }
}

testProdLogin();

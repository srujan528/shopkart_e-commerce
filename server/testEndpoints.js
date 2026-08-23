async function testEndpoints() {
  console.log("Testing GET /products ...");
  try {
    const res1 = await fetch("https://shopkart-e-commerce.vercel.app/products");
    console.log("GET /products Status:", res1.status, res1.statusText);
    const text1 = await res1.text();
    console.log("GET /products Body length:", text1.length, "snippet:", text1.slice(0, 100));
  } catch (e) {
    console.error("GET /products error:", e.message);
  }

  console.log("\nTesting GET /auth/check ...");
  try {
    const res2 = await fetch("https://shopkart-e-commerce.vercel.app/auth/check");
    console.log("GET /auth/check Status:", res2.status, res2.statusText);
    const text2 = await res2.text();
    console.log("GET /auth/check Body:", text2);
  } catch (e) {
    console.error("GET /auth/check error:", e.message);
  }
}

testEndpoints();

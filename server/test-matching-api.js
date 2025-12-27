/**
 * Test script for ML Matching APIs
 * This script demonstrates how the ML service (Rishika) will interact with the backend
 *
 * Usage:
 * 1. Start the backend server: npm run dev
 * 2. Run this test: node test-matching-api.js
 */

import fetch from "node-fetch";

const BASE_URL = "http://localhost:5000/api";

// Test configuration
const TEST_CONFIG = {
  // You'll need a valid JWT token for testing the protected endpoint
  // Get this by logging in through the frontend or Postman
  JWT_TOKEN: "your-jwt-token-here", // Replace with actual token

  // Test data for ML results
  SAMPLE_ML_RESULTS: {
    sourceUserId: "507f1f77bcf86cd799439011", // Replace with actual user ID
    matches: [
      {
        userId: "507f1f77bcf86cd799439012",
        similarityScore: 0.87,
      },
      {
        userId: "507f1f77bcf86cd799439013",
        similarityScore: 0.79,
      },
      {
        userId: "507f1f77bcf86cd799439014",
        similarityScore: 0.76,
      },
    ],
  },
};

/**
 * Test 1: Fetch matching data for ML processing
 * GET /api/matching/data
 */
async function testFetchMatchingData() {
  console.log("\n🔍 Testing: GET /api/matching/data");
  console.log("=".repeat(50));

  try {
    const response = await fetch(`${BASE_URL}/matching/data`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TEST_CONFIG.JWT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!");
      console.log(
        `📊 Found ${data.data.count} users with completed onboarding`
      );
      console.log("\n📋 Sample data structure:");
      if (data.data.users.length > 0) {
        console.log(JSON.stringify(data.data.users[0], null, 2));
      }
    } else {
      console.log("❌ Failed!");
      console.log("Error:", data.message);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

/**
 * Test 2: Send ML results back to backend
 * POST /api/matching/results
 */
async function testSendMatchingResults() {
  console.log("\n🤖 Testing: POST /api/matching/results");
  console.log("=".repeat(50));

  try {
    const response = await fetch(`${BASE_URL}/matching/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(TEST_CONFIG.SAMPLE_ML_RESULTS),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!");
      console.log(`📤 Processed ${data.data.matchesProcessed} matches`);
      console.log(`👤 For user: ${data.data.sourceUserId}`);
    } else {
      console.log("❌ Failed!");
      console.log("Error:", data.message);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

/**
 * Test 3: Get user matches (placeholder)
 * GET /api/matching/:userId
 */
async function testGetUserMatches() {
  console.log("\n📊 Testing: GET /api/matching/:userId");
  console.log("=".repeat(50));

  const testUserId = TEST_CONFIG.SAMPLE_ML_RESULTS.sourceUserId;

  try {
    const response = await fetch(`${BASE_URL}/matching/${testUserId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TEST_CONFIG.JWT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Success!");
      console.log(`📋 Found ${data.data.count} matches for user ${testUserId}`);
    } else {
      console.log("❌ Failed!");
      console.log("Error:", data.message);
    }
  } catch (error) {
    console.log("❌ Network Error:", error.message);
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log("🧪 ML Matching API Tests");
  console.log("=".repeat(50));
  console.log("📝 Instructions for ML teammate (Rishika):");
  console.log("1. Update JWT_TOKEN with a valid token from login");
  console.log("2. Update user IDs with actual ObjectIds from your database");
  console.log("3. Run: node test-matching-api.js");

  // Check if token is configured
  if (TEST_CONFIG.JWT_TOKEN === "your-jwt-token-here") {
    console.log("\n⚠️  Please configure JWT_TOKEN before running tests");
    console.log("   Get a token by logging in through the frontend or API");
    return;
  }

  // Run tests
  await testFetchMatchingData();
  await testSendMatchingResults();
  await testGetUserMatches();

  console.log("\n🎉 Tests completed!");
  console.log("\n📚 Next steps for ML integration:");
  console.log("1. Use GET /api/matching/data to fetch user quiz data");
  console.log("2. Calculate cosine similarity in your ML service");
  console.log("3. Send results back via POST /api/matching/results");
  console.log("4. Backend will handle filtering and chat initiation");
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { testFetchMatchingData, testSendMatchingResults, testGetUserMatches };

# ML Integration Guide for ConnectAI Matching

## 🎯 Overview

This guide explains how to integrate your ML service with the ConnectAI backend for user matching using cosine similarity.

## 🔄 Data Flow

```
1. ML Service → GET /api/matching/data → Backend
2. ML Service → Calculate Cosine Similarity → ML Service
3. ML Service → POST /api/matching/results → Backend
4. Backend → Filter & Store → Database
5. Frontend → Display Matches → Users
```

## 📡 API Endpoints

### 1. GET /api/matching/data

**Purpose**: Fetch user quiz data for ML processing

**Authentication**: Required (JWT Bearer token)

**Response Format**:

```json
{
  "success": true,
  "message": "Matching data retrieved successfully",
  "data": {
    "users": [
      {
        "userId": "507f1f77bcf86cd799439011",
        "quizAnswers": {
          "1": 0,
          "2": 3,
          "3": 1,
          "4": 2,
          "5": 0,
          "6": 1,
          "7": 3,
          "8": 2,
          "9": 0,
          "10": 1
        }
      }
    ],
    "count": 25,
    "note": "Data prepared for cosine similarity calculation"
  }
}
```

**Quiz Answer Format**:

- Keys: Question IDs ("1" to "10")
- Values: Selected option index (0, 1, 2, or 3)
- Each user has exactly 10 quiz answers

### 2. POST /api/matching/results

**Purpose**: Send similarity results back to backend

**Authentication**: Not required (internal ML service call)

**Request Format**:

```json
{
  "sourceUserId": "507f1f77bcf86cd799439011",
  "matches": [
    {
      "userId": "507f1f77bcf86cd799439012",
      "similarityScore": 0.87
    },
    {
      "userId": "507f1f77bcf86cd799439013",
      "similarityScore": 0.79
    }
  ]
}
```

**Response Format**:

```json
{
  "success": true,
  "message": "Matching results received successfully",
  "data": {
    "sourceUserId": "507f1f77bcf86cd799439011",
    "matchesProcessed": 2,
    "note": "Results logged - ready for chat matching integration"
  }
}
```

## 🧮 Cosine Similarity Implementation

### Data Preparation

1. **Fetch Data**: Call `GET /api/matching/data`
2. **Create Vectors**: Convert quiz answers to numerical vectors
3. **Normalize**: Ensure vectors are normalized for cosine similarity

### Example Vector Conversion

```python
# User quiz answers: {"1": 0, "2": 3, "3": 1, ...}
# Convert to vector: [0, 3, 1, 2, 0, 1, 3, 2, 0, 1]

def quiz_to_vector(quiz_answers):
    """Convert quiz answers to vector for cosine similarity"""
    vector = []
    for i in range(1, 11):  # Questions 1-10
        vector.append(quiz_answers.get(str(i), 0))
    return vector
```

### Similarity Calculation

```python
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_similarity(user_vectors):
    """Calculate cosine similarity between all users"""
    # Convert to numpy array
    vectors = np.array(user_vectors)

    # Calculate cosine similarity matrix
    similarity_matrix = cosine_similarity(vectors)

    return similarity_matrix
```

### Filtering & Results

```python
def process_matches(similarity_matrix, user_ids, threshold=0.75):
    """Process similarity results and format for backend"""
    results = []

    for i, source_user in enumerate(user_ids):
        matches = []

        for j, target_user in enumerate(user_ids):
            if i != j:  # Don't match user with themselves
                score = similarity_matrix[i][j]

                if score >= threshold:  # Filter by threshold
                    matches.append({
                        "userId": target_user,
                        "similarityScore": float(score)
                    })

        # Sort by similarity score (highest first)
        matches.sort(key=lambda x: x["similarityScore"], reverse=True)

        if matches:  # Only send if user has matches
            results.append({
                "sourceUserId": source_user,
                "matches": matches[:10]  # Limit to top 10 matches
            })

    return results
```

## 🔧 Implementation Steps

### Step 1: Setup

```python
import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

BASE_URL = "http://localhost:5000/api"
```

### Step 2: Fetch Data

```python
def fetch_matching_data(jwt_token):
    """Fetch user data from backend"""
    headers = {
        "Authorization": f"Bearer {jwt_token}",
        "Content-Type": "application/json"
    }

    response = requests.get(f"{BASE_URL}/matching/data", headers=headers)

    if response.status_code == 200:
        return response.json()["data"]["users"]
    else:
        raise Exception(f"Failed to fetch data: {response.text}")
```

### Step 3: Process & Calculate

```python
def process_users(users_data):
    """Convert users to vectors and calculate similarity"""
    user_ids = []
    vectors = []

    for user in users_data:
        user_ids.append(user["userId"])
        vector = quiz_to_vector(user["quizAnswers"])
        vectors.append(vector)

    # Calculate similarity
    similarity_matrix = cosine_similarity(vectors)

    # Process results
    results = process_matches(similarity_matrix, user_ids)

    return results
```

### Step 4: Send Results

```python
def send_results(results):
    """Send results back to backend"""
    for result in results:
        response = requests.post(
            f"{BASE_URL}/matching/results",
            json=result,
            headers={"Content-Type": "application/json"}
        )

        if response.status_code != 200:
            print(f"Failed to send results for {result['sourceUserId']}")
        else:
            print(f"✅ Sent {len(result['matches'])} matches for user {result['sourceUserId']}")
```

## 🧪 Testing

1. **Run Test Script**: `node test-matching-api.js`
2. **Update Configuration**: Add valid JWT token and user IDs
3. **Verify Endpoints**: Check all three endpoints work correctly

## 📊 Expected Output

```
🤖 AI Matching Service - ML Processing
==================================================
📥 Fetching user data from backend...
✅ Found 25 users with completed onboarding

🧮 Calculating cosine similarity...
   Processing similarity matrix (25x25)
   Applying threshold filter (≥ 0.75)
   Found matches for 18/25 users

📤 Sending results to backend...
   ✅ User 507f1f77bcf86cd799439011 - 3 matches sent
   ✅ User 507f1f77bcf86cd799439012 - 2 matches sent
   ✅ User 507f1f77bcf86cd799439013 - 4 matches sent

🎉 ML processing complete!
💡 Users can now check matches in the frontend
```

## 🔒 Security Notes

- **Data Privacy**: Only quiz answers and user IDs are shared
- **No Sensitive Data**: Email, passwords, names are excluded
- **Threshold Filtering**: Only matches ≥ 75% similarity are processed
- **Rate Limiting**: API endpoints have rate limiting enabled

## 🚀 Production Considerations

- **Batch Processing**: Process users in batches for large datasets
- **Caching**: Cache similarity calculations for performance
- **Async Processing**: Use queues for non-blocking operations
- **Error Handling**: Implement retry logic for API calls
- **Monitoring**: Add logging and metrics for ML pipeline

## 📞 Support

For questions about the API integration:

1. Check the test script output for debugging
2. Review server logs for detailed error messages
3. Verify JWT token is valid and not expired
4. Ensure user IDs are valid MongoDB ObjectIds

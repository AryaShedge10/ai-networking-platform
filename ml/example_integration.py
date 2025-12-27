"""
Example ML Integration Script for ConnectAI Matching
This script demonstrates how to integrate with the backend APIs for user matching

Requirements:
pip install requests scikit-learn numpy

Usage:
1. Start the backend server
2. Update JWT_TOKEN with a valid token
3. Run: python example_integration.py
"""

import requests
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import json

# Configuration
BASE_URL = "http://localhost:5000/api"
JWT_TOKEN = "your-jwt-token-here"  # Replace with actual JWT token
SIMILARITY_THRESHOLD = 0.75

def fetch_matching_data():
    """
    Fetch user quiz data from backend
    Returns list of users with userId and quizAnswers
    """
    print("📥 Fetching user data from backend...")
    
    headers = {
        "Authorization": f"Bearer {JWT_TOKEN}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/matching/data", headers=headers)
        response.raise_for_status()
        
        data = response.json()
        users = data["data"]["users"]
        
        print(f"✅ Found {len(users)} users with completed onboarding")
        return users
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching data: {e}")
        return []

def quiz_to_vector(quiz_answers):
    """
    Convert quiz answers dictionary to numerical vector
    
    Args:
        quiz_answers (dict): Dictionary with question IDs as keys and answer indices as values
        
    Returns:
        list: Vector of 10 numerical values (0-3)
    """
    vector = []
    for i in range(1, 11):  # Questions 1-10
        answer_index = quiz_answers.get(str(i), 0)
        vector.append(answer_index)
    return vector

def calculate_user_similarities(users_data):
    """
    Calculate cosine similarity between all users
    
    Args:
        users_data (list): List of user dictionaries with userId and quizAnswers
        
    Returns:
        tuple: (similarity_matrix, user_ids)
    """
    print("🧮 Calculating cosine similarity...")
    
    user_ids = []
    vectors = []
    
    # Convert quiz answers to vectors
    for user in users_data:
        user_ids.append(user["userId"])
        vector = quiz_to_vector(user["quizAnswers"])
        vectors.append(vector)
    
    # Convert to numpy array for sklearn
    vectors_array = np.array(vectors)
    
    # Calculate cosine similarity matrix
    similarity_matrix = cosine_similarity(vectors_array)
    
    print(f"   Processed similarity matrix ({len(user_ids)}x{len(user_ids)})")
    
    return similarity_matrix, user_ids

def process_matches(similarity_matrix, user_ids, threshold=SIMILARITY_THRESHOLD):
    """
    Process similarity matrix and create match results
    
    Args:
        similarity_matrix (numpy.ndarray): Cosine similarity matrix
        user_ids (list): List of user IDs
        threshold (float): Minimum similarity score to include
        
    Returns:
        list: List of match results for each user
    """
    print(f"🔍 Processing matches with threshold ≥ {threshold}")
    
    results = []
    total_matches = 0
    
    for i, source_user in enumerate(user_ids):
        matches = []
        
        for j, target_user in enumerate(user_ids):
            if i != j:  # Don't match user with themselves
                score = similarity_matrix[i][j]
                
                if score >= threshold:
                    matches.append({
                        "userId": target_user,
                        "similarityScore": float(score)
                    })
        
        # Sort by similarity score (highest first)
        matches.sort(key=lambda x: x["similarityScore"], reverse=True)
        
        if matches:
            # Limit to top 10 matches per user
            top_matches = matches[:10]
            
            results.append({
                "sourceUserId": source_user,
                "matches": top_matches
            })
            
            total_matches += len(top_matches)
            print(f"   User {source_user[:8]}... - {len(top_matches)} matches")
    
    print(f"✅ Found matches for {len(results)}/{len(user_ids)} users")
    print(f"📊 Total matches: {total_matches}")
    
    return results

def send_results_to_backend(results):
    """
    Send matching results back to backend
    
    Args:
        results (list): List of match results to send
    """
    print("📤 Sending results to backend...")
    
    success_count = 0
    
    for result in results:
        try:
            response = requests.post(
                f"{BASE_URL}/matching/results",
                json=result,
                headers={"Content-Type": "application/json"}
            )
            response.raise_for_status()
            
            success_count += 1
            user_id = result["sourceUserId"][:8] + "..."
            match_count = len(result["matches"])
            print(f"   ✅ User {user_id} - {match_count} matches sent")
            
        except requests.exceptions.RequestException as e:
            user_id = result["sourceUserId"][:8] + "..."
            print(f"   ❌ Failed to send results for user {user_id}: {e}")
    
    print(f"📊 Successfully sent results for {success_count}/{len(results)} users")

def main():
    """
    Main function to run the ML matching process
    """
    print("🤖 ConnectAI ML Matching Service")
    print("=" * 50)
    
    # Check if JWT token is configured
    if JWT_TOKEN == "your-jwt-token-here":
        print("⚠️  Please configure JWT_TOKEN before running")
        print("   Get a token by logging in through the frontend or API")
        return
    
    # Step 1: Fetch user data
    users_data = fetch_matching_data()
    if not users_data:
        print("❌ No user data available. Exiting.")
        return
    
    # Step 2: Calculate similarities
    similarity_matrix, user_ids = calculate_user_similarities(users_data)
    
    # Step 3: Process matches
    results = process_matches(similarity_matrix, user_ids)
    
    if not results:
        print("❌ No matches found above threshold. Try lowering the threshold.")
        return
    
    # Step 4: Send results to backend
    send_results_to_backend(results)
    
    print("\n🎉 ML matching process completed!")
    print("💡 Users can now check their matches in the frontend")

def analyze_quiz_data(users_data):
    """
    Analyze quiz data distribution (optional utility function)
    """
    print("\n📊 Quiz Data Analysis")
    print("-" * 30)
    
    # Analyze answer distributions
    question_stats = {}
    
    for user in users_data:
        for question_id, answer_index in user["quizAnswers"].items():
            if question_id not in question_stats:
                question_stats[question_id] = [0, 0, 0, 0]
            question_stats[question_id][answer_index] += 1
    
    for question_id in sorted(question_stats.keys(), key=int):
        distribution = question_stats[question_id]
        total = sum(distribution)
        percentages = [f"{(count/total)*100:.1f}%" for count in distribution]
        print(f"Q{question_id}: {percentages}")

if __name__ == "__main__":
    main()
    
    # Uncomment to run analysis
    # users_data = fetch_matching_data()
    # if users_data:
    #     analyze_quiz_data(users_data)
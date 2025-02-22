import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt

# Download VADER sentiment analysis tool
nltk.download('vader_lexicon')
sia = SentimentIntensityAnalyzer()

# Psychological questions
questions = [
    "What’s the first word that comes to your mind when you hear ‘flowers’?",
    "Complete the sentence: ‘Life is…’",
    "You’re walking alone at night, and you hear footsteps behind you. What’s your immediate reaction?",
    "You find a wallet full of money on the street. What do you do?",
    "A friend cancels on you last minute. What’s your immediate thought?",
    "A stranger smiles at you. How do you interpret it?",
    "If your mind was a weather condition, what would it be?",
    "Describe your reflection in a mirror, but not physically."
]

# Function to analyze sentiment and assign risk score
def analyze_response(response):
    sentiment_score = sia.polarity_scores(response)['compound']
    
    # Convert sentiment to mental health risk score (0 = good, 10 = high risk)
    if sentiment_score >= 0.5:
        return 0  # Very positive
    elif sentiment_score >= 0.2:
        return 2  # Slightly positive
    elif sentiment_score >= -0.2:
        return 5  # Neutral or mixed
    elif sentiment_score >= -0.5:
        return 7  # Slightly negative
    else:
        return 10  # Very negative (high risk)

# Collect user responses
responses = []
risk_scores = []

print("\n🔍 Mental Health Assessment\n")
for i, question in enumerate(questions):
    response = input(f"{i+1}. {question}\n> ")
    responses.append(response)
    risk_scores.append(analyze_response(response))

# Calculate overall mental health risk score (average)
overall_score = sum(risk_scores) / len(risk_scores)

# Generate Report
print("\n📊 Mental Health Report\n")
for i, question in enumerate(questions):
    print(f"{i+1}. {question}")
    print(f"   📝 Response: {responses[i]}")
    print(f"   🔹 Risk Score: {risk_scores[i]}/10\n")

print(f"🔴 Overall Mental Health Risk Score: {round(overall_score, 1)}/10")

# Risk level assessment
if overall_score <= 3:
    print("✅ Low risk - Healthy mental state.")
elif overall_score <= 6:
    print("⚠️ Moderate risk - Consider self-care and mindfulness.")
else:
    print("❗ High risk - Consider professional support.")

# Plot results
plt.figure(figsize=(10, 5))
plt.bar(range(1, len(questions)+1), risk_scores, color=['green' if s <= 3 else 'yellow' if s <= 6 else 'red' for s in risk_scores])
plt.xlabel("Questions")
plt.ylabel("Mental Health Risk Score (0-10)")
plt.title("Mental Health Risk Per Question")
plt.xticks(range(1, len(questions)+1))
plt.ylim(0, 10)
plt.show()


from ai_engine.pipeline import evaluate_student
from ai_engine.questions import load_questions, get_correct_answer

# Load the real question bank
questions = load_questions()

# Build a test submission using the actual answer key.
# This is only for backend testing.
answers = {
    question["id"]: get_correct_answer(question["id"])
    for question in questions
}

request_data = {
    "student_id": "student_001",
    "topic": "Machine Learning",
    "quiz_answers": answers,
    "learning_preferences": {
        "preferred_format": "visual",
        "preferred_pace": "normal",
        "language": "English"
    },
    "accessibility": {
        "disability_type": ["dyslexia"],
        "needs_simplified_text": True,
        "needs_audio_support": True,
        "needs_high_contrast": True
    }
}

# Run the actual adaptive learning pipeline
result = evaluate_student(request_data)

print("\n===== AI EVALUATION RESULT =====")
print("Success:", result["success"])
print("Student:", result["student_id"])
print("Topic:", result["topic"])

print("\nDiagnostic:")
print(result["diagnostic"])

print("\nAdaptive:")
print(result["adaptive"])

print("\nPersonalized recommendations:")
print(result["personalized_recommendations"])

print("\nAccessibility support:")
print(result["accessibility_support"])

print("\nAI PIPELINE TEST COMPLETED!")

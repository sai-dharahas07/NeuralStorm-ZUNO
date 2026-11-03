
from ai_engine.adaptive_engine import (
    adaptive_learning_engine
)

from ai_engine.learning_content import (
    get_learning_content
)

questions = [
    {
        "question": "What is Artificial Intelligence?",
        "options": [
            "A. A programming language",
            "B. Technology that enables machines to simulate intelligence",
            "C. A computer hardware component",
            "D. An operating system"
        ],
        "answer": "B"
    },
    {
        "question": "Which language is commonly used in Machine Learning?",
        "options": ["A. HTML", "B. CSS", "C. Python", "D. XML"],
        "answer": "C"
    },
    {
        "question": "What is Machine Learning?",
        "options": [
            "A. Learning from data",
            "B. Creating web pages",
            "C. Installing software",
            "D. Designing hardware"
        ],
        "answer": "A"
    },
    {
        "question": "Which library is commonly used for data analysis?",
        "options": ["A. Pandas", "B. React", "C. HTML", "D. Bootstrap"],
        "answer": "A"
    },
    {
        "question": "What is the purpose of a training dataset?",
        "options": [
            "A. To store images only",
            "B. To train a machine learning model",
            "C. To design websites",
            "D. To create passwords"
        ],
        "answer": "B"
    }
]


def start_quiz():
    score = 0

    print("\n===== NeuroLearn Diagnostic Quiz =====")

    for i, q in enumerate(questions, start=1):
        print(f"\nQuestion {i}: {q['question']}")

        for option in q["options"]:
            print(option)

        user_answer = input("Enter your answer (A/B/C/D): ").upper().strip()

        if user_answer == q["answer"]:
            print("Correct!")
            score += 1
        else:
            print("Incorrect!")
            print("Correct answer:", q["answer"])

    percentage = (score / len(questions)) * 100

    print("\n===== Quiz Result =====")
    print("Total Questions:", len(questions))
    print("Correct Answers:", score)
    print("Score:", percentage, "%")

    return percentage



if __name__ == "__main__":

    quiz_score = start_quiz()

    result = adaptive_learning_engine(quiz_score)

    level = result["learning_level"]

    print("\n===== NeuroLearn Personalized Learning =====")
    print("Learning Level:", level)
    print("Difficulty:", result["difficulty"])

    print("\n===== Personalized Recommendations =====")

    for key, value in result["recommendations"].items():
        print(f"{key.replace('_', ' ').title()}: {value}")

    topic = "Machine Learning"

    explanation = get_learning_content(topic, level)

    print("\n===== Personalized Learning Content =====")
    print("Topic:", topic)
    print("Student Level:", level)
    print(explanation)

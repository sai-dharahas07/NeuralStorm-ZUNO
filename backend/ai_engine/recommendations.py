
def get_recommendations(learning_level):

    recommendations = {
        "Beginner": {
            "explanation": "Simplified explanations with basic examples",
            "practice": "Basic practice questions",
            "content": "Fundamental concepts",
            "next_action": "Review basics and retry the quiz"
        },

        "Intermediate": {
            "explanation": "Detailed explanations with practical examples",
            "practice": "Medium difficulty practice questions",
            "content": "Intermediate concepts",
            "next_action": "Practice more and improve understanding"
        },

        "Advanced": {
            "explanation": "Advanced explanations with technical examples",
            "practice": "Challenging practice questions",
            "content": "Advanced concepts",
            "next_action": "Explore advanced topics and projects"
        }
    }

    if learning_level not in recommendations:
        raise ValueError("Invalid learning level")

    return recommendations[learning_level]


if __name__ == "__main__":

    level = input(
        "Enter learning level (Beginner/Intermediate/Advanced): "
    ).strip().title()

    result = get_recommendations(level)

    print("\n===== Personalized Recommendations =====")

    for key, value in result.items():
        print(f"{key.replace('_', ' ').title()}: {value}")

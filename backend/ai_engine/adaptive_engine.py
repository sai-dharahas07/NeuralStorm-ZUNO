from ai_engine.difficulty import (
    calculate_learning_level,
    get_difficulty
)

from ai_engine.recommendations import (
    get_recommendations
)


def adaptive_learning_engine(score_percentage):

    level = calculate_learning_level(score_percentage)

    difficulty = get_difficulty(level)

    recommendations = get_recommendations(level)

    return {
        "score_percentage": score_percentage,
        "learning_level": level,
        "difficulty": difficulty,
        "recommendations": recommendations
    }


if __name__ == "__main__":

    score = float(input("Enter quiz score percentage: "))

    result = adaptive_learning_engine(score)

    print("\n===== NeuroLearn Adaptive Engine =====")

    print("Score:", result["score_percentage"])
    print("Learning Level:", result["learning_level"])
    print("Difficulty:", result["difficulty"])

    print("\nRecommendations:")

    for key, value in result["recommendations"].items():
        print(f"{key}: {value}")

def calculate_learning_level(score_percentage):
    """
    Determines student learning level based on quiz score.

    Input:
        score_percentage: float (0 to 100)

    Output:
        str: Beginner, Intermediate, or Advanced
    """

    if not 0 <= score_percentage <= 100:
        raise ValueError("Score must be between 0 and 100")

    if score_percentage <= 40:
        return "Beginner"

    elif score_percentage <= 70:
        return "Intermediate"

    else:
        return "Advanced"


def get_difficulty(learning_level):

    difficulty_mapping = {
        "Beginner": "Easy",
        "Intermediate": "Medium",
        "Advanced": "Hard"
    }

    return difficulty_mapping.get(
        learning_level,
        "Easy"
    )


if __name__ == "__main__":

    score = float(input("Enter student quiz percentage: "))

    level = calculate_learning_level(score)

    difficulty = get_difficulty(level)

    print("\n===== Adaptive Learning Result =====")
    print("Score:", score, "%")
    print("Learning Level:", level)
    print("Recommended Difficulty:", difficulty)

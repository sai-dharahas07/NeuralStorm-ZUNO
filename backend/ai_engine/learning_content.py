
def get_learning_content(topic, learning_level):

    content = {

        "Machine Learning": {

            "Beginner": """
Machine Learning is a technology that allows computers
to learn from data and make predictions.

Example:
A computer learns from previous exam marks
and predicts a student's performance.
""",

            "Intermediate": """
Machine Learning uses algorithms to identify patterns
in datasets and generate predictions.

Example:
A regression model uses previous student marks,
study hours, and attendance to predict exam scores.
""",

            "Advanced": """
Machine Learning is a computational approach that
learns model parameters from training data
to minimize a defined loss function.

Example:
Linear Regression estimates parameters by minimizing
the Mean Squared Error (MSE).
"""
        }
    }

    if topic not in content:
        raise ValueError("Topic not available")

    if learning_level not in content[topic]:
        raise ValueError("Invalid learning level")

    return content[topic][learning_level]


if __name__ == "__main__":

    topic = input("Enter topic (Machine Learning): ").strip()

    level = input(
        "Enter learning level (Beginner/Intermediate/Advanced): "
    ).strip().title()

    explanation = get_learning_content(topic, level)

    print("\n===== NeuroLearn Personalized Content =====")
    print(explanation)


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DisabilitySelection.css";
import {useLanguage,t} from "../i18n";

const disabilities = [
  {
    id: "dyslexia",
    title: "Dyslexia",
    description: "Reading and writing support",
    emoji: "📖",
  },
  {
    id: "adhd",
    title: "ADHD",
    description: "Focus and attention support",
    emoji: "🎯",
  },
  {
    id: "visual",
    title: "Visual Disability",
    description: "Visual accessibility support",
    emoji: "👁️",
  },
  {
    id: "hearing",
    title: "Hearing Disability",
    description: "Text-based learning support",
    emoji: "👂",
  },
  {
    id: "none",
    title: "No Disability",
    description: "Standard adaptive learning",
    emoji: "🌟",
  },
];

export default function DisabilitySelection() {
  const navigate = useNavigate();
  const lang=useLanguage();
  const [selected, setSelected] = useState([]);

  const toggleSelection = (id) => {
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const continueLearning = () => {
    if (selected.length === 0) {
      alert("Please select an option to continue.");
      return;
    }

    localStorage.setItem(
      "neuralstorm_disabilities",
      JSON.stringify(selected)
    );

    navigate("/learning-preferences");
  };

  const translated={
    te:[['డిస్లెక్సియా','చదవడం మరియు రాయడం సహాయం'],['ADHD','ఏకాగ్రత సహాయం'],['దృశ్య వైకల్యం','దృశ్య ప్రాప్యత సహాయం'],['వినికిడి వైకల్యం','టెక్స్ట్ ఆధారిత అభ్యాస సహాయం'],['ఎంపిక లేదు','సాధారణ అనుకూల అభ్యాసం']],
    hi:[['डिस्लेक्सिया','पढ़ने और लिखने में सहायता'],['ADHD','ध्यान और एकाग्रता सहायता'],['दृष्टि संबंधी सहायता','दृश्य सुलभता सहायता'],['सुनने संबंधी सहायता','टेक्स्ट आधारित सीखने में सहायता'],['कोई नहीं','सामान्य अनुकूल सीखना']]
  };
  return (
    <main className="disability-page" data-language={lang}>
      <header className="disability-header">
        
        <h1>{t("supportPrompt")}</h1>
        <p>{t("supportIntro")}</p>
      </header>

      <section className="disability-grid">
        {disabilities.map((item) => (
          <button
            key={item.id}
            className={`disability-card ${
              selected.includes(item.id) ? "selected" : ""
            }`}
            onClick={() => toggleSelection(item.id)}
            aria-pressed={selected.includes(item.id)}
          >
            <span className="disability-emoji">{item.emoji}</span>
            <h2>{translated[lang]?.[disabilities.indexOf(item)]?.[0]||item.title}</h2>
            <p>{translated[lang]?.[disabilities.indexOf(item)]?.[1]||item.description}</p>
          </button>
        ))}
      </section>

      <button className="disability-continue" onClick={continueLearning}>
        {t("continueFlow")} →
      </button>
    </main>
  );
}


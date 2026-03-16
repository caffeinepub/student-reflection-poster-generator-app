interface Suggestion {
  tip: string;
  rewrite: string;
}

interface ImprovementSuggestions {
  clarity: Suggestion;
  structure: Suggestion;
  tone: Suggestion;
}

export function improveReflection(text: string): ImprovementSuggestions {
  // Clarity: Simplify sentences
  const clarityRewrite = simplifySentences(text);

  // Structure: Add context-action-learning framework
  const structureRewrite = addStructure(text);

  // Tone: Make more professional
  const toneRewrite = makeProfessional(text);

  return {
    clarity: {
      tip: "Break down complex sentences into shorter, clearer statements for better readability.",
      rewrite: clarityRewrite,
    },
    structure: {
      tip: "Organize your reflection using Context → Action → Learning → Next Steps framework.",
      rewrite: structureRewrite,
    },
    tone: {
      tip: "Use more formal language and active voice to sound more professional.",
      rewrite: toneRewrite,
    },
  };
}

function simplifySentences(text: string): string {
  // Split long sentences and simplify
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  return sentences
    .map((sentence) => {
      let simplified = sentence.trim();

      // Replace complex phrases with simpler ones
      simplified = simplified
        .replace(/in order to/gi, "to")
        .replace(/due to the fact that/gi, "because")
        .replace(/at this point in time/gi, "now")
        .replace(/in the event that/gi, "if")
        .replace(/with regard to/gi, "about");

      return simplified;
    })
    .join(" ");
}

function addStructure(text: string): string {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  if (sentences.length < 2) {
    return `Context: ${text}\n\nWhat I learned: This experience taught me valuable lessons.\n\nNext steps: I will apply these insights moving forward.`;
  }

  const third = Math.floor(sentences.length / 3);
  const context = sentences.slice(0, third).join(" ");
  const action = sentences.slice(third, third * 2).join(" ");
  const learning = sentences.slice(third * 2).join(" ");

  return `Context: ${context}\n\nAction: ${action}\n\nLearning: ${learning}\n\nNext steps: I will continue to build on these insights.`;
}

function makeProfessional(text: string): string {
  let professional = text;

  // Replace casual phrases with professional ones
  professional = professional
    .replace(/\bI think\b/gi, "I believe")
    .replace(/\bkinda\b/gi, "somewhat")
    .replace(/\bsorta\b/gi, "somewhat")
    .replace(/\bgonna\b/gi, "going to")
    .replace(/\bwanna\b/gi, "want to")
    .replace(/\blots of\b/gi, "many")
    .replace(/\ba lot of\b/gi, "many")
    .replace(/\bstuff\b/gi, "material")
    .replace(/\bthings\b/gi, "aspects")
    .replace(/\bgot\b/gi, "obtained")
    .replace(/\bpretty\b/gi, "quite");

  // Ensure first letter is capitalized
  professional = professional.charAt(0).toUpperCase() + professional.slice(1);

  return professional;
}

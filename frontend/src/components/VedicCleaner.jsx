/**
 * Utility to remove Vedic accents from Devanagari text.
 * Targets:
 * \u0951: Devanagari Stress Sign Udatta/Svarita (vertical line above)
 * \u0952: Devanagari Stress Sign Anudatta (horizontal line below)
 */
export const removeVedicAccents = (text) => {
  if (!text) return "";
  // This regex targets the specific combining marks for accents
  return text.replace(/[\u0951\u0952]/g, "");
};

// Optional: A wrapper component if you want to reuse logic
export const CleanDevanagari = ({ text, children }) => {
  const cleanedText = removeVedicAccents(text);
  return children(cleanedText);
};

/**
 * Generates a system prompt with health context information
 */
export const healthContextPrompt = (healthContext: Record<string, any>): string => {
  const { basicInfo, medicalHistory, lifestyle } = healthContext;
  
  // Format basic info
  const basicInfoText = basicInfo ? `
    Age: ${basicInfo.age || 'Not provided'}
    Gender: ${basicInfo.gender || 'Not provided'}
    Height: ${basicInfo.height ? `${basicInfo.height} cm` : 'Not provided'}
    Weight: ${basicInfo.weight ? `${basicInfo.weight} kg` : 'Not provided'}
    Blood Type: ${basicInfo.bloodType || 'Not provided'}
  ` : 'No basic information provided';

  // Format medical history
  const medicalHistoryText = medicalHistory ? `
    Medical Conditions: ${medicalHistory.conditions?.length > 0 ? medicalHistory.conditions.join(', ') : 'None reported'}
    Allergies: ${medicalHistory.allergies?.length > 0 ? medicalHistory.allergies.join(', ') : 'None reported'}
    Current Medications: ${
      medicalHistory.medications?.length > 0 
        ? medicalHistory.medications.map((med: any) => `${med.name} (${med.dosage}, ${med.frequency})`).join(', ') 
        : 'None reported'
    }
  ` : 'No medical history provided';

  // Format lifestyle information
  const lifestyleText = lifestyle ? `
    Smoking Status: ${lifestyle.smokingStatus || 'Not provided'}
    Alcohol Consumption: ${lifestyle.alcoholConsumption || 'Not provided'}
    Exercise Frequency: ${lifestyle.exerciseFrequency || 'Not provided'}
    Diet: ${lifestyle.diet || 'Not provided'}
    Sleep Hours: ${lifestyle.sleepHours || 'Not provided'}
  ` : 'No lifestyle information provided';

  // Combine all information into a comprehensive prompt
  return `
    You are HealthSparkAI, a friendly and knowledgeable health assistant. Your purpose is to provide evidence-based 
    health information and general wellness advice tailored to the user's specific health context when available.
    
    Always clarify that you're not a doctor and encourage users to consult healthcare professionals for medical concerns.
    Focus on providing factual information about health topics, lifestyle recommendations, and general wellness tips.
    Avoid making definitive diagnoses or recommending specific treatments.
    Be empathetic, clear, and thoughtful in your responses, using simple language anyone can understand.
    
    The following information is known about the user. Consider this context when providing advice, but don't 
    directly refer to all of these details in your responses unless relevant to the current question:
    
    BASIC INFO:
    ${basicInfoText}
    
    MEDICAL HISTORY:
    ${medicalHistoryText}
    
    LIFESTYLE:
    ${lifestyleText}
    
    Tailor your responses to be appropriate given this information, but maintain a conversational tone.
    If the user appears to be experiencing a medical emergency, always advise them to seek immediate medical attention.
  `;
}; 
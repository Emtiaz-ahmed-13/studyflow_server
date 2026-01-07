import config from "./index";
import logger from "./logger.config";

const GEMINI_API_KEY = config.gemini.api_key;
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

/**
 * Generate content using Gemini AI (Direct API call)
 */
const generateContent = async (prompt: string): Promise<string> => {
    try {
        logger.info("Generating AI content", { promptLength: prompt.length });

        const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`API request failed: ${response.status} - ${error}`);
        }

        const data = await response.json();
        const text = data.candidates[0]?.content?.parts[0]?.text || "";

        logger.info("AI content generated successfully", { responseLength: text.length });
        return text;
    } catch (error: any) {
        logger.error("Error generating AI content", { error: error.message });
        throw new Error(`AI generation failed: ${error.message}`);
    }
};

const generateStructuredContent = async <T>(prompt: string): Promise<T> => {
    try {
        const text = await generateContent(prompt);
        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No valid JSON found in AI response");
    } catch (error: any) {
        logger.error("Error generating structured AI content", { error: error.message });
        throw error;
    }
};

const generateQuestions = async (topic: string, count: number, difficulty: string) => {
    const prompt = `Generate ${count} multiple choice questions about "${topic}" with difficulty level: ${difficulty}.

For each question, provide:
1. Question text
2. Four options (A, B, C, D)
3. Correct answer (A, B, C, or D)
4. Brief explanation

Format as JSON array:
[
  {
    "questionText": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],
    "correctAnswer": "A",
    "explanation": "..."
  }
]`;

    return await generateStructuredContent<any[]>(prompt);
};


const analyzeStudyPatterns = async (studyData: any) => {
    const prompt = `Analyze the following study session data and provide insights:

${JSON.stringify(studyData, null, 2)}

Provide analysis in JSON format:
{
  "totalStudyTime": <minutes>,
  "averageProductivity": <0-100>,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "preferredStudyHours": [hour1, hour2],
  "mostProductiveSubjects": ["subject1", "subject2"],
  "leastProductiveSubjects": ["subject1", "subject2"]
}`;

    return await generateStructuredContent<any>(prompt);
};

/**
 * Generate study plan
 */
const generateStudyPlan = async (subjects: string[], examDate: Date, currentDate: Date) => {
    const daysUntilExam = Math.ceil((examDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));

    const prompt = `Create a detailed study plan for the following subjects: ${subjects.join(", ")}

Days until exam: ${daysUntilExam}
Exam date: ${examDate.toDateString()}

Provide a study plan in JSON format:
{
  "title": "Study Plan for ...",
  "description": "...",
  "tasks": [
    {
      "title": "...",
      "description": "...",
      "priority": 0-2,
      "estimatedHours": <number>,
      "dayNumber": <1-${daysUntilExam}>
    }
  ]
}`;

    return await generateStructuredContent<any>(prompt);
};

/**
 * Extract topics from reading material
 */
const extractTopics = async (content: string) => {
    const prompt = `Extract the main topics and key concepts from the following text:

${content.substring(0, 3000)}

Provide response in JSON format:
{
  "topics": ["topic1", "topic2", ...],
  "keyConcepts": ["concept1", "concept2", ...],
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}`;

    return await generateStructuredContent<any>(prompt);
};

/**
 * Generate summary of reading material
 */
const generateSummary = async (content: string) => {
    const prompt = `Summarize the following text in 3-5 concise bullet points:

${content.substring(0, 3000)}

Provide a clear, student-friendly summary.`;

    return await generateContent(prompt);
};

/**
 * Validate and score note comprehension
 */
const validateNotes = async (noteContent: string, subject: string) => {
    const prompt = `Analyze these study notes for "${subject}" and provide feedback:

${noteContent}

Provide analysis in JSON format:
{
  "comprehensionScore": <0-100>,
  "completeness": <0-100>,
  "clarity": <0-100>,
  "missingConcepts": ["concept1", "concept2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "strengths": ["strength1", "strength2"]
}`;

    return await generateStructuredContent<any>(prompt);
};

/**
 * Generate personalized study recommendations
 */
const generateRecommendations = async (userProfile: any) => {
    const prompt = `Based on this student profile, generate personalized study recommendations:

${JSON.stringify(userProfile, null, 2)}

Provide recommendations in JSON format:
{
  "recommendations": [
    {
      "type": "STUDY_TIME" | "FOCUS_DURATION" | "SUBJECT_PRIORITY" | "BREAK_REMINDER" | "WORKLOAD_ADJUSTMENT",
      "title": "...",
      "description": "...",
      "priority": 0-2
    }
  ]
}`;

    return await generateStructuredContent<any>(prompt);
};

export const geminiAI = {
    generateContent,
    generateStructuredContent,
    generateQuestions,
    analyzeStudyPatterns,
    generateStudyPlan,
    extractTopics,
    generateSummary,
    validateNotes,
    generateRecommendations,
};

export default geminiAI;

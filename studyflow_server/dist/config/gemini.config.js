"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiAI = void 0;
const index_1 = __importDefault(require("./index"));
const logger_config_1 = __importDefault(require("./logger.config"));
const GEMINI_API_KEY = index_1.default.gemini.api_key;
const API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";
/**
 * Generate content using Gemini AI (Direct API call)
 */
const generateContent = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        logger_config_1.default.info("Generating AI content", { promptLength: prompt.length });
        const response = yield fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
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
            const error = yield response.text();
            throw new Error(`API request failed: ${response.status} - ${error}`);
        }
        const data = yield response.json();
        const text = ((_c = (_b = (_a = data.candidates[0]) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.parts[0]) === null || _c === void 0 ? void 0 : _c.text) || "";
        logger_config_1.default.info("AI content generated successfully", { responseLength: text.length });
        return text;
    }
    catch (error) {
        logger_config_1.default.error("Error generating AI content", { error: error.message });
        throw new Error(`AI generation failed: ${error.message}`);
    }
});
const generateStructuredContent = (prompt) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const text = yield generateContent(prompt);
        // Try to parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error("No valid JSON found in AI response");
    }
    catch (error) {
        logger_config_1.default.error("Error generating structured AI content", { error: error.message });
        throw error;
    }
});
const generateQuestions = (topic, count, difficulty) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield generateStructuredContent(prompt);
});
const analyzeStudyPatterns = (studyData) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield generateStructuredContent(prompt);
});
/**
 * Generate study plan
 */
const generateStudyPlan = (subjects, examDate, currentDate) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield generateStructuredContent(prompt);
});
/**
 * Extract topics from reading material
 */
const extractTopics = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `Extract the main topics and key concepts from the following text:

${content.substring(0, 3000)}

Provide response in JSON format:
{
  "topics": ["topic1", "topic2", ...],
  "keyConcepts": ["concept1", "concept2", ...],
  "difficulty": "EASY" | "MEDIUM" | "HARD"
}`;
    return yield generateStructuredContent(prompt);
});
/**
 * Generate summary of reading material
 */
const generateSummary = (content) => __awaiter(void 0, void 0, void 0, function* () {
    const prompt = `Summarize the following text in 3-5 concise bullet points:

${content.substring(0, 3000)}

Provide a clear, student-friendly summary.`;
    return yield generateContent(prompt);
});
/**
 * Validate and score note comprehension
 */
const validateNotes = (noteContent, subject) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield generateStructuredContent(prompt);
});
/**
 * Generate personalized study recommendations
 */
const generateRecommendations = (userProfile) => __awaiter(void 0, void 0, void 0, function* () {
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
    return yield generateStructuredContent(prompt);
});
exports.geminiAI = {
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
exports.default = exports.geminiAI;

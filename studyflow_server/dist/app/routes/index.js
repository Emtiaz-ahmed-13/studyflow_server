"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ai_chat_routes_1 = require("../modules/AIChat/ai-chat.routes");
const ai_recommendation_routes_1 = require("../modules/AIRecommendation/ai-recommendation.routes");
const ai_viva_routes_1 = require("../modules/AIViva/ai-viva.routes");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const budget_routes_1 = require("../modules/Budget/budget.routes");
const class_schedule_routes_1 = require("../modules/ClassSchedule/class-schedule.routes");
const course_routes_1 = require("../modules/Course/course.routes");
const daily_routine_routes_1 = require("../modules/DailyRoutine/daily-routine.routes");
const exam_routes_1 = require("../modules/Exam/exam.routes");
const gamification_routes_1 = require("../modules/Gamification/gamification.routes");
const habit_challenge_routes_1 = require("../modules/HabitChallenge/habit-challenge.routes");
const note_routes_1 = require("../modules/Note/note.routes");
const notification_routes_1 = require("../modules/Notification/notification.routes");
const reading_material_routes_1 = require("../modules/ReadingMaterial/reading-material.routes");
const study_group_routes_1 = require("../modules/StudyGroup/study-group.routes");
const study_plan_routes_1 = require("../modules/StudyPlan/study-plan.routes");
const study_task_routes_1 = require("../modules/StudyTask/study-task.routes");
const study_technique_routes_1 = require("../modules/StudyTechnique/study-technique.routes");
const subject_routes_1 = require("../modules/Subject/subject.routes");
const wellness_routes_1 = require("../modules/Wellness/wellness.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    { path: "/auth", route: auth_routes_1.AuthRoutes },
    { path: "/notifications", route: notification_routes_1.NotificationRoutes },
    { path: "/ai-recommendations", route: ai_recommendation_routes_1.AIRecommendationRoutes },
    { path: "/subjects", route: subject_routes_1.SubjectRoutes },
    { path: "/courses", route: course_routes_1.CourseRoutes },
    { path: "/class-schedules", route: class_schedule_routes_1.ClassScheduleRoutes },
    { path: "/study-plans", route: study_plan_routes_1.StudyPlanRoutes },
    { path: "/study-tasks", route: study_task_routes_1.StudyTaskRoutes },
    { path: "/notes", route: note_routes_1.NoteRoutes },
    { path: "/finance", route: budget_routes_1.BudgetRoutes },
    { path: "/exams", route: exam_routes_1.ExamRoutes },
    { path: "/study-groups", route: study_group_routes_1.StudyGroupRoutes },
    { path: "/study-techniques", route: study_technique_routes_1.StudyTechniqueRoutes },
    { path: "/wellness", route: wellness_routes_1.WellnessRoutes },
    { path: "/habit-challenges", route: habit_challenge_routes_1.HabitChallengeRoutes },
    { path: "/daily-routines", route: daily_routine_routes_1.DailyRoutineRoutes },
    { path: "/gamification", route: gamification_routes_1.GamificationRoutes },
    { path: "/ai-viva", route: ai_viva_routes_1.AIVivaRoutes },
    { path: "/ai-chat", route: ai_chat_routes_1.AIChatRoutes },
    { path: "/reading-materials", route: reading_material_routes_1.ReadingMaterialRoutes },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;

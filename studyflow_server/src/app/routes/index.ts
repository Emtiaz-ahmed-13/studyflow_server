import express from "express";
import { AIChatRoutes } from "../modules/AIChat/ai-chat.routes";
import { AIRecommendationRoutes } from "../modules/AIRecommendation/ai-recommendation.routes";
import { AIVivaRoutes } from "../modules/AIViva/ai-viva.routes";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { BudgetRoutes } from "../modules/Budget/budget.routes";
import { ClassScheduleRoutes } from "../modules/ClassSchedule/class-schedule.routes";
import { CourseRoutes } from "../modules/Course/course.routes";
import { DailyRoutineRoutes } from "../modules/DailyRoutine/daily-routine.routes";
import { ExamRoutes } from "../modules/Exam/exam.routes";
import { GamificationRoutes } from "../modules/Gamification/gamification.routes";
import { HabitChallengeRoutes } from "../modules/HabitChallenge/habit-challenge.routes";
import { NoteRoutes } from "../modules/Note/note.routes";
import { NotificationRoutes } from "../modules/Notification/notification.routes";
import { ReadingMaterialRoutes } from "../modules/ReadingMaterial/reading-material.routes";
import { StudyGroupRoutes } from "../modules/StudyGroup/study-group.routes";
import { StudyPlanRoutes } from "../modules/StudyPlan/study-plan.routes";
import { StudyTaskRoutes } from "../modules/StudyTask/study-task.routes";
import { StudyTechniqueRoutes } from "../modules/StudyTechnique/study-technique.routes";
import { SubjectRoutes } from "../modules/Subject/subject.routes";
import { WellnessRoutes } from "../modules/Wellness/wellness.routes";


const router = express.Router();
const moduleRoutes = [
  { path: "/auth", route: AuthRoutes },
  { path: "/notifications", route: NotificationRoutes },
  { path: "/ai-recommendations", route: AIRecommendationRoutes },
  { path: "/subjects", route: SubjectRoutes },
  { path: "/courses", route: CourseRoutes },
  { path: "/class-schedules", route: ClassScheduleRoutes },
  { path: "/study-plans", route: StudyPlanRoutes },
  { path: "/study-tasks", route: StudyTaskRoutes },
  { path: "/notes", route: NoteRoutes },
  { path: "/finance", route: BudgetRoutes },
  { path: "/exams", route: ExamRoutes },
  { path: "/study-groups", route: StudyGroupRoutes },
  { path: "/study-techniques", route: StudyTechniqueRoutes },
  { path: "/wellness", route: WellnessRoutes },
  { path: "/habit-challenges", route: HabitChallengeRoutes },
  { path: "/daily-routines", route: DailyRoutineRoutes },
  { path: "/gamification", route: GamificationRoutes },
  { path: "/ai-viva", route: AIVivaRoutes },
  { path: "/ai-chat", route: AIChatRoutes },
  { path: "/reading-materials", route: ReadingMaterialRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;

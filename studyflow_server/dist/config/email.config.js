"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailTemplates = exports.emailTransporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.emailTransporter = nodemailer_1.default.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT || "587"),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});
/**
 * Email Templates
 */
exports.emailTemplates = {
    examReminder: (examTitle, examDate) => ({
        subject: `Exam Reminder: ${examTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #4CAF50;">📚 Exam Reminder</h2>
          <p>Hi there!</p>
          <p>This is a friendly reminder that your exam <strong>${examTitle}</strong> is scheduled for:</p>
          <p style="font-size: 18px; color: #333; background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
            📅 ${examDate}
          </p>
          <p>Make sure you're well-prepared. Good luck! 🍀</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">StudyFlow - Your AI-Powered Study Companion</p>
        </div>
      </div>
    `,
        text: `Exam Reminder: ${examTitle} is scheduled for ${examDate}. Good luck!`,
    }),
    deadlineAlert: (taskTitle, deadline) => ({
        subject: `Deadline Alert: ${taskTitle}`,
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #FF9800;">⏰ Deadline Alert</h2>
          <p>Hi there!</p>
          <p>Your task <strong>${taskTitle}</strong> is approaching its deadline:</p>
          <p style="font-size: 18px; color: #333; background-color: #fff3e0; padding: 15px; border-radius: 5px;">
            📅 ${deadline}
          </p>
          <p>Don't forget to complete it on time!</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">StudyFlow - Your AI-Powered Study Companion</p>
        </div>
      </div>
    `,
        text: `Deadline Alert: ${taskTitle} is due on ${deadline}.`,
    }),
    streakWarning: (currentStreak) => ({
        subject: "Don't Break Your Streak! 🔥",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #F44336;">🔥 Streak Warning</h2>
          <p>Hi there!</p>
          <p>You're on a <strong>${currentStreak}-day study streak</strong>! Don't let it break today.</p>
          <p style="font-size: 18px; color: #fff; background-color: #F44336; padding: 15px; border-radius: 5px; text-align: center;">
            Start a study session now to keep your streak alive! 💪
          </p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">StudyFlow - Your AI-Powered Study Companion</p>
        </div>
      </div>
    `,
        text: `Don't break your ${currentStreak}-day study streak! Start a session today.`,
    }),
    focusSessionComplete: (duration, productivity) => ({
        subject: "Focus Session Complete! 🎉",
        html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
          <h2 style="color: #2196F3;">🎉 Focus Session Complete</h2>
          <p>Great job! You've completed a focus session:</p>
          <ul style="font-size: 16px; line-height: 1.8;">
            <li>Duration: <strong>${duration} minutes</strong></li>
            <li>Productivity Score: <strong>${productivity}%</strong></li>
          </ul>
          <p>Keep up the great work! 🚀</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
          <p style="color: #888; font-size: 12px;">StudyFlow - Your AI-Powered Study Companion</p>
        </div>
      </div>
    `,
        text: `Focus session complete! Duration: ${duration} min, Productivity: ${productivity}%`,
    }),
};

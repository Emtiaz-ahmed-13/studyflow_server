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
exports.CourseController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const course_services_1 = require("./course.services");
/**
 * Create a new course
 */
const createCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const data = req.body;
    const result = yield course_services_1.CourseService.createCourse(userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Course created successfully",
        data: result,
    });
}));
/**
 * Get all courses for the authenticated user
 */
const getMyCourses = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { subjectId, semester, year, searchTerm, page, limit } = req.query;
    const result = yield course_services_1.CourseService.getCourses({
        userId,
        subjectId: subjectId,
        semester: semester,
        year: year ? parseInt(year) : undefined,
        searchTerm: searchTerm,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Courses retrieved successfully",
        data: result.data,
        meta: result.meta,
    });
}));
/**
 * Get a single course by ID
 */
const getCourseById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield course_services_1.CourseService.getCourseById(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Course retrieved successfully",
        data: result,
    });
}));
/**
 * Update a course
 */
const updateCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const data = req.body;
    const result = yield course_services_1.CourseService.updateCourse(id, userId, data);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Course updated successfully",
        data: result,
    });
}));
/**
 * Delete a course
 */
const deleteCourse = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { id } = req.params;
    const result = yield course_services_1.CourseService.deleteCourse(id, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: null,
    });
}));
exports.CourseController = {
    createCourse,
    getMyCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
};

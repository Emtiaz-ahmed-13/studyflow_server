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
exports.StudyGroupController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const study_group_services_1 = require("./study-group.services");
const createStudyGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_group_services_1.StudyGroupService.createStudyGroup((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Study group created successfully", data: result });
}));
const getMyStudyGroups = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_group_services_1.StudyGroupService.getMyStudyGroups((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Study groups retrieved successfully", data: result });
}));
const getStudyGroupById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_group_services_1.StudyGroupService.getStudyGroupById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: "Study group retrieved successfully", data: result });
}));
const addMember = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_group_services_1.StudyGroupService.addMember((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(res, { statusCode: 201, success: true, message: "Member added successfully", data: result });
}));
const deleteStudyGroup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield study_group_services_1.StudyGroupService.deleteStudyGroup(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
    (0, sendResponse_1.default)(res, { statusCode: 200, success: true, message: result.message, data: null });
}));
exports.StudyGroupController = {
    createStudyGroup,
    getMyStudyGroups,
    getStudyGroupById,
    addMember,
    deleteStudyGroup,
};

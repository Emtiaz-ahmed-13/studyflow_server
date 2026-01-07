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
exports.StudyTechniqueController = void 0;
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const study_technique_services_1 = require("./study-technique.services");
const createTechnique = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.createTechnique(user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Study technique session recorded successfully",
        data: result,
    });
}));
const getAllTechniques = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.getAllTechniques(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study techniques retrieved successfully",
        data: result,
    });
}));
const getTechniqueById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.getTechniqueById(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study technique retrieved successfully",
        data: result,
    });
}));
const updateTechnique = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.updateTechnique(req.params.id, user.id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study technique updated successfully",
        data: result,
    });
}));
const deleteTechnique = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.deleteTechnique(req.params.id, user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study technique deleted successfully",
        data: result,
    });
}));
const getAnalytics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield study_technique_services_1.StudyTechniqueService.getAnalytics(user.id);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Study technique analytics retrieved successfully",
        data: result,
    });
}));
exports.StudyTechniqueController = {
    createTechnique,
    getAllTechniques,
    getTechniqueById,
    updateTechnique,
    deleteTechnique,
    getAnalytics,
};

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
exports.extractYouTubeId = exports.getYouTubePlaylistDuration = exports.getYouTubeVideoDuration = void 0;
const axios_1 = __importDefault(require("axios"));
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";
/**
 * Convert ISO 8601 duration to seconds
 * Example: PT1H2M10S -> 3730
 */
const parseDuration = (duration) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match)
        return 0;
    const hours = match[1] ? parseInt(match[1].replace("H", "")) : 0;
    const minutes = match[2] ? parseInt(match[2].replace("M", "")) : 0;
    const seconds = match[3] ? parseInt(match[3].replace("S", "")) : 0;
    return hours * 3600 + minutes * 60 + seconds;
};
const getYouTubeVideoDuration = (videoId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!YOUTUBE_API_KEY) {
        console.warn("YOUTUBE_API_KEY is not set");
        return null;
    }
    try {
        const response = yield axios_1.default.get(`${YOUTUBE_BASE_URL}/videos`, {
            params: {
                id: videoId,
                part: "contentDetails",
                key: YOUTUBE_API_KEY,
            },
        });
        const items = response.data.items;
        if (items && items.length > 0) {
            const duration = items[0].contentDetails.duration;
            return parseDuration(duration);
        }
        return null;
    }
    catch (error) {
        console.error("Error fetching YouTube video duration:", error);
        return null;
    }
});
exports.getYouTubeVideoDuration = getYouTubeVideoDuration;
const getYouTubePlaylistDuration = (playlistId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!YOUTUBE_API_KEY) {
        console.warn("YOUTUBE_API_KEY is not set");
        return null;
    }
    try {
        let totalDuration = 0;
        let nextPageToken = "";
        do {
            // 1. Get video IDs from playlist
            const plResponse = yield axios_1.default.get(`${YOUTUBE_BASE_URL}/playlistItems`, {
                params: {
                    playlistId: playlistId,
                    part: "contentDetails",
                    maxResults: 50,
                    pageToken: nextPageToken,
                    key: YOUTUBE_API_KEY,
                },
            });
            const videoIds = plResponse.data.items.map((item) => item.contentDetails.videoId).join(",");
            nextPageToken = plResponse.data.nextPageToken;
            if (!videoIds)
                continue;
            // 2. Get duration for these videos
            const vidResponse = yield axios_1.default.get(`${YOUTUBE_BASE_URL}/videos`, {
                params: {
                    id: videoIds,
                    part: "contentDetails",
                    key: YOUTUBE_API_KEY,
                },
            });
            vidResponse.data.items.forEach((item) => {
                totalDuration += parseDuration(item.contentDetails.duration);
            });
        } while (nextPageToken);
        return totalDuration;
    }
    catch (error) {
        console.error("Error fetching YouTube playlist duration:", error);
        return null;
    }
});
exports.getYouTubePlaylistDuration = getYouTubePlaylistDuration;
const extractYouTubeId = (url) => {
    const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const playlistRegex = /[?&]list=([^#\&\?]+)/;
    const playlistMatch = url.match(playlistRegex);
    if (playlistMatch) {
        return { type: "PLAYLIST", id: playlistMatch[1] };
    }
    const videoMatch = url.match(videoRegex);
    if (videoMatch) {
        return { type: "VIDEO", id: videoMatch[1] };
    }
    return { type: null, id: null };
};
exports.extractYouTubeId = extractYouTubeId;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signIn_1 = __importDefault(require("./signIn"));
const { getUserClient, createUserClient, deleteUserClient, putUserClient, getPsychologistDetails, googleLogin } = require('./userClient');
const validateClient = require('../../middleware/validateClient');
const validateAdmin = require('../../middleware/validateAdminToken');
const clientRouter = (0, express_1.Router)();
const jwt = require("jsonwebtoken");
const upload = require('../../middleware/upload');
clientRouter.get('/client', validateClient, getUserClient);
clientRouter.get('/:IdUserPsychologist', validateClient, getPsychologistDetails);
clientRouter.post('/client/register', upload.single('profileImage'), createUserClient);
clientRouter.post('/client/login', signIn_1.default);
clientRouter.delete('/deleteuserclient', validateClient, deleteUserClient);
clientRouter.put('/editprofile', upload.single('profileImage'), validateClient, putUserClient);
//Falta middleware solo de admin
module.exports = clientRouter;
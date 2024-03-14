"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signIn_1 = __importDefault(require("./signIn"));
const { getUserPsychologistOne, getUserPsychologist, postUserPsychologist, deleteUserPsychologist, putUserPsychologist, filterPsichologistSpecialities, filterPsichologistRating, getUserPsychologistByStatus, getReviews, getPsychologistDetails, putAvailableTimes } = require('./userPsychologist');
const validatePsychologist = require('../../middleware/validatePsychologist');
const validateClient = require('../../middleware/validateClient');
const validateUsers = require('../../middleware/validateUsers');
const upload = require('../../middleware/upload');
const psychologistRouter = (0, express_1.Router)();
// psychologistRouter.get('/', validatePychologist , getUserPsychologistOne); aca sería validación para inicio de sesión
psychologistRouter.get('/profile', validatePsychologist, getUserPsychologistOne);
psychologistRouter.get('/:IdUserPsichologist', validatePsychologist, getPsychologistDetails);
psychologistRouter.get('/', getUserPsychologist);
psychologistRouter.get('/status/psycologiststatus', getUserPsychologistByStatus); //Uso admin
psychologistRouter.post('/', upload.single('profileImage'), postUserPsychologist); //registro
psychologistRouter.post('/login', signIn_1.default);
psychologistRouter.delete('/deleteuserpsychologist/', validatePsychologist, deleteUserPsychologist);
psychologistRouter.put('/put_userpsychologist', upload.single('profileImage'), validatePsychologist, putUserPsychologist);
psychologistRouter.get('/filterspecialties/specialties/:specialtie', filterPsichologistSpecialities);
//psychologistRouter.get('/filterrating/rating', filterPsichologistRating);
psychologistRouter.get('/rese/reviews', getReviews);
/* psychologistRouter.put('/psychologistschedule', validatePsychologist, putAvailableTimes)
 */
module.exports = psychologistRouter;

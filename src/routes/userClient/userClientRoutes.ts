import { Router } from "express";
import logInClient from "./signIn";
const {
  getUserClient,
  createUserClient,
  deleteUserClient,
  putUserClient,
  getPsychologistDetails,
  googleLogin
} = require('./userClient')
const validateClient = require('../../middleware/validateClient')
const validateAdmin = require('../../middleware/ValidateAdminToken')
import { Request, Response } from "express";
import userClientModel from "../../models/userClients";
import userPsychologistModel from "../../models/userPsychologist";
const clientRouter: Router = Router();
const jwt = require("jsonwebtoken");
const upload   = require('../../middleware/upload');


clientRouter.get('/client', validateClient, getUserClient);
clientRouter.get('/:IdUserPsychologist', validateClient, getPsychologistDetails)
clientRouter.post('/client/register', upload.single('profileImage'), createUserClient)
clientRouter.post('/client/login', logInClient)
clientRouter.delete('/deleteuserclient', validateClient, deleteUserClient)
clientRouter.put('/editprofile', upload.single('profileImage'), validateClient, putUserClient)

//Falta middleware solo de admin
module.exports = clientRouter;  

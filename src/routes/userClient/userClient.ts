import { Request, Response } from "express";
import userClientModel from "../../models/userClients"
import userPsychologistModel from "../../models/userPsychologist";


const nodemailer = require("nodemailer");


const getUserClient = async (req: Request, res: Response) => {
  try {
     const userClient = await userClientModel.findById(req.user);
     res.status(200).json(userClient);
  }
  catch (err) {
     res.status(404).send(err);
  }
};

const getPsychologistDetails = async (req: Request, res: Response) => {
  const { IdUserPsychologist } = req.params;
  try {
    const psychologistUser = await userPsychologistModel.findById(
      IdUserPsychologist,
      "-password"
    );
    res.status(200).json(psychologistUser);
  } catch (err) {
    res.status(404).json({ data: err });
  }
};

const createUserClient = async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    birthdate,
    country,
    email,
    password,
  } = req.body;

  const profileImage = req.file?.path

  try {
    const userExist = await userClientModel.findOne({ email: email });
    if (userExist) {
      return res.json({ error: "User already exists" });
    } else {
      const userClient = await userClientModel.create({
        firstName: firstname,
        lastName: lastname,
        birthDate: birthdate,
        country: country,
        email: email,
        profileImage: profileImage,
        password: password,
        role: "client",
      });
      res.status(201).send("Welcome to our community, now you can sign in");
    }
  } catch (error) {
    res.status(405).send(error);
  }
};


const deleteUserClient = async (req: Request, res: Response) => {
  try {
    const userClientDelete = await userClientModel.findOneAndDelete(req.user);
    res.send("Usuario eliminado correctamente");
  } catch (err) {
    res.status(404).send("There was an error...");
  }
};


const putUserClient = async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    email,
    country,
  } = req.body;

  const profileImage = req.file?.path


  try {
    const user = await userClientModel.findByIdAndUpdate(req.user, req.body, {
      firstname,
      lastname,
      email,
      country,
      profileImage: profileImage,
      new: true
    })
    res.status(200).send('Usuario editado correctamente')
  } catch (err) {
    res.status(404).send('There was an error...');
  }
};



module.exports = {
  getUserClient,
  createUserClient,
  deleteUserClient,
  putUserClient,
  getPsychologistDetails,
};

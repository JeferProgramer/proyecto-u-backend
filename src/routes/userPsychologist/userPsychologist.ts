import { Request, Response, NextFunction } from "express";

import userPsychologistModel from "../../models/userPsychologist";
import userPsychologist from "../../models/userPsychologist";
//import { userPsychologist } from '../../models/userPsychologist';
const nodemailer = require("nodemailer");


const getUserPsychologistOne = async (req: Request, res: Response) => {
  try {
    const psychologistUser = await userPsychologistModel.findById(req.user, '-password');
    res.status(200).json(psychologistUser)
  } catch (err) {
    res.status(404).json({ data: err })
  }
}

const getPsychologistDetails = async (req: Request, res: Response) => {
  const { IdUserPsichologist } = req.params
  try {
    const psychologistUser = await userPsychologistModel.findById(IdUserPsichologist, '-password');
    res.status(200).json(psychologistUser)

  } catch (err) {
    res.status(404).json({ data: err });
  }
};

const getUserPsychologistByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const psychologistUserEmail = await userPsychologistModel.findOne(
      { email: email },
      "-password"
    );
    res.status(200).json(psychologistUserEmail);
  } catch (err) {
    res.status(404).json({ data: err });
  }
}

const getUserPsychologistByStatus = async (req: Request, res: Response) => {
  try {
    const userPsychologistStatus = await userPsychologistModel.find(
      { status: "Activo", psychologistStatus: "Activo" },
      "-password"
    );
    res.status(200).json(userPsychologistStatus);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ msj: "No se encontraron resultados" });
  }
};

const getUserPsychologist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;

    if (name) {
      userPsychologistModel.find(
          {
            $or: [
              { firstName: { $regex: name, $options: "i" } },
              { lastName: { $regex: name, $options: "i" } },
            ],
          },
          "-password"
        )
        .then((psychologist) => {
          res.status(200).json(psychologist);
        })
        .catch((error: any) => next(error));
    } else {
      const userPsychologist = await userPsychologistModel.find(
        {},
        "-password"
      );
      res.status(200).json(userPsychologist);
    }
  } catch (err) {
    res.status(404).json({ data: err });
  }
};
////Post/////

const postUserPsychologist = async (req: Request, res: Response) => {
  const {
    firstname,
    lastname,
    email,
    password,
    birthdate,
    location,
    latitude,
    longitude,
    license,
    dni,
    specialities,
    rating,
    education,
    about,
  } = req.body;

  const profileImage = req.file?.path

  try {
    const psychologistExist = await userPsychologistModel.findOne({
      email: email,
    });
    if (psychologistExist) {
      return res.json({ error: "User already exists" });
    } else {
      const userP = await userPsychologistModel.create({
        firstName: firstname,
        lastName: lastname,
        email,
        password,
        birthDate: birthdate,
        location,
        latitude,
        longitude,
        License: license,
        DNI: dni,
        Specialties: specialities,
        profileImage: profileImage,
        rating: 1,
        status: "Pendiente",
        psychologistStatus: "Activo",
        about,
        education,
        role: 'psychologist'
      });
      res.status(201).send("Welcome to our community, now you can sign in");
    }
  } catch (error) {
    console.log(error);
  }
};
///// Delete /////

const deleteUserPsychologist = async (req: Request, res: Response) => {
  try {
    const userPsichologistDelete =
      await userPsychologistModel.findByIdAndDelete(
        req.user,
        function (err: any, docs: any) {
          if (err) {
            console.log(err);
          } else {
            console.log("deleted: ", docs);
          }
        }
      );
    res.send("Psicologo eliminado correctamente");
  } catch (err) {
    res.status(404).send("There was an error...");
  }
};

const putUserPsychologist = async (req: Request, res: Response) => {

  const {
    firstname,
    lastname,
    email,
    location,
    specialities,
    dni,
    about,
  } = req.body;

  const profileImage = req.file?.path

  try {
    await userPsychologistModel.findByIdAndUpdate(req.user, {
      profileImage: req.file?.path,
      firstname,
      lastname,
      email,
      location,
      specialities,
      dni,
      about,
      new: true,

    });
    res.status(200).send("Usuario editado correctamente");
  } catch (error) {
    res.status(404).send(error);
  }
};

const filterPsichologistSpecialities = async (req: Request, res: Response) => {
  const { specialtie } = req.params;
  console.log(specialtie);
  try {
    const PsychologistBySpecialtie = await userPsychologistModel.find({
      Specialties: { $in: [specialtie] },
    });
    if (PsychologistBySpecialtie.length !== 0) {
      res.status(200).json(PsychologistBySpecialtie);
    } else {
      res.status(404).json({ msj: "No hay psicologos con esa especialidad" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).send({ msj: "No se encontraron resultados" });
  }
};

/* const putAvailableTimes = async (req: Request, res: Response) => {
  try {
    await userPsychologistModel.findByIdAndUpdate(req.user, req.body, { new: true })
    res.status(200).send('Horarios agregados correctamente')
  } catch {
    res.status(404).send('There was an error...');
  }
} */


// // const filterPsichologistRating = async (req: Request, res: Response) => {

// //   try {
// //     const PsichologistByRating = await userPsychologistModel.find({}, { 'rating': 1, "_id": 0 });
// //     const orderDesc = PsichologistByRating.sort((a, b) => b.rating - a.rating);
// //     res.status(200).json(orderDesc)

// //   } catch (error) {
// //     console.log(error)
// //     return res.status(404).send({ msj: 'No se encontraron resultados' });
// //   }

// // };

const getReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await userPsychologistModel.find().populate({
      path: "rating",
    });
    res.status(200).json(reviews);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getUserPsychologistOne,
  getUserPsychologist,
  postUserPsychologist,
  deleteUserPsychologist,
  putUserPsychologist,
  getUserPsychologistByEmail,
  filterPsichologistSpecialities,
  getUserPsychologistByStatus,
  getReviews,
  getPsychologistDetails,
  /* putAvailableTimes */
}

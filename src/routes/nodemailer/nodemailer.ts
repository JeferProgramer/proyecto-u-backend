import { Request, Response } from "express";
import userClientModel from "../../models/userClients";
import userPsychologistModel from "../../models/userPsychologist";
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
import * as crypto from "crypto";


const ForgotPassword = async (req: Request, res: Response) => {

  const { email, role } = req.body;

  let userPsychologist = await userPsychologistModel.find({
    "email": email,
    "role": role
  })

  let userClient = await userClientModel.find({
    "email": email,
    "role": role
  })


  try {

    const user = userPsychologist.length < 1 ? userClient : userPsychologist

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "terapeandoportal@gmail.com",
        pass: "pezufzhvclfbmuti"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    transporter.verify().then(
      () => {
        console.log('Ready for send email')
      })


    const newPassword = crypto.randomBytes(8).toString('hex')

    try {

      const sendEmail = await transporter.sendMail({
        from: `Terapeando <terapeandoportal@gmail.com>`,
        to: `${email}`,
        subject: "Recuperación de contraseña Terapeando",
        text: `Hola ${user[0].firstName} tu nueva contraseña para iniciar sesión es: ${newPassword}`,
        html: `<strong>Hola ${user[0].firstName}!  tu nueva contraseña para iniciar sesión es: ${newPassword} </strong><a href= https://terapeando.vercel.app/signin>ir a Terapeando</a>`,
        headers: { 'x-myheader': 'test header' }
      }).then(async () => {

        const saltRounds = Number(process.env.SALTROUNDS)

        bcrypt.hash(newPassword, saltRounds, async (error: any, hashedPassword: any) => {

          if (user[0].role === "psychologist") {
            console.log({ 'aqui llego un psicologo': userPsychologist[0].role })

            const update = await userPsychologistModel.findByIdAndUpdate(userPsychologist[0]._id,
              { password: hashedPassword },
              { new: true });
            res.status(201).send("email sended");

          } else {
            console.log({ 'aqui llego un paciente': userClient[0].role })
            const update = await userClientModel.findByIdAndUpdate(userClient[0]._id,
              { password: hashedPassword },
              { new: true });
            res.status(201).send("email sended");

          }


        })
      })

    } catch (error) {
      console.log(error);
      res.status(404).json({ msg: 'email not found' })
    }

  } catch (error) {
    return res.status(404).json({ msg: 'user not found' });

  }
}


module.exports = {
  ForgotPassword
}
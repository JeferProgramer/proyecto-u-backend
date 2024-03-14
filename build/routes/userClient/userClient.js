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
const userClients_1 = __importDefault(require("../../models/userClients"));
const userPsychologist_1 = __importDefault(require("../../models/userPsychologist"));
const nodemailer = require("nodemailer");
const getUserClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userClient = yield userClients_1.default.findById(req.user);
        res.status(200).json(userClient);
    }
    catch (err) {
        res.status(404).send(err);
    }
});
const getPsychologistDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { IdUserPsychologist } = req.params;
    try {
        const psychologistUser = yield userPsychologist_1.default.findById(IdUserPsychologist, "-password");
        res.status(200).json(psychologistUser);
    }
    catch (err) {
        res.status(404).json({ data: err });
    }
});
const createUserClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { firstname, lastname, birthdate, country, email, password, } = req.body;
    const profileImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path;
    try {
        const userExist = yield userClients_1.default.findOne({ email: email });
        if (userExist) {
            return res.json({ error: "User already exists" });
        }
        else {
            const userClient = yield userClients_1.default.create({
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
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "terapeandoportal@gmail.com",
                    pass: "pezufzhvclfbmuti",
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            transporter.verify().then(() => {
                console.log("Ready to send emails");
            });
            let mailOptions = {
                from: `Terapeando <terapeandoportal@gmail.com>`,
                to: `${email}`,
                subject: "Confirmacion de registro",
                html: `<h1>Bienvenido ${firstname} ${lastname} a Terapeando!</h1>
                  <p>Tu cuenta para ${email} ha sido creada con éxito.
   <p>Tu cuenta para ${email} ha sido creada con éxito.
                  Para ingresar a tu cuenta haz click <a href= https://terapeando.vercel.app/signin>aqui<a/></p>
            `,
            };
            yield transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.log("Hubo un error: ", error);
                }
                else {
                    console.log("Email enviado!");
                }
            });
        }
    }
    catch (error) {
        res.status(405).send(error);
    }
});
const deleteUserClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userClientDelete = yield userClients_1.default.findOneAndDelete(req.user);
        res.send("Usuario eliminado correctamente");
    }
    catch (err) {
        res.status(404).send("There was an error...");
    }
});
const putUserClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { firstName, lastName, email, country, } = req.body;
    const profileImage = (_b = req.file) === null || _b === void 0 ? void 0 : _b.path;
    try {
          const user = yield userClients_1.default.findByIdAndUpdate(req.user, {
      firstName: firstName,
      lastName: lastName,
      email, 
      country,
      profileImage 
    }, {new: true})
    res.status(200).send('Usuario editado correctamente')
    }
    catch (err) {
        res.status(404).send('There was an error...');
    }
});

module.exports = {
    getUserClient,
    createUserClient,
    deleteUserClient,
    putUserClient,
    getPsychologistDetails,
};

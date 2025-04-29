var fs = require('fs');
const express = require('express');
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');

// Importer la bibliothèque Nodemailer
const sendMail = require('../utils/mailer');

////////////////////
const tickets = express.Router();
var Ticket = require('../models/Ticket');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

tickets.use(bodyParser.urlencoded({ extended: false }));
tickets.use(bodyParser.json());

const DIR = 'public/';
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.toLowerCase().split(' ').join('-'));
    }
});

var upload = multer({ storage: storage });

tickets.get('/getTicketAll', (req, res) => {
    Ticket.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Erreur lors de la récupération des tickets." });
        } else {
            res.json(items);
        }
    });
});

// Uploading the image & sending email
tickets.post('/addTickets', upload.array('img'), async (req, res, next) => {
    console.log("req body", req.body);
    console.log("req files", req.files);

    var obj = {
        name: req.body.name,
        img: req.files[0] ? req.files[0].filename : null, // Vérifier si un fichier est présent
        content: req.body.content,
        messages: { "text": req.body.messages },
        role: req.body.role,
    };

    try {
        const result = await Ticket.create(obj);
        console.log("Ticket créé:", result);

        // Envoyer un e-mail de confirmation
        await sendMail({
            to: "chabaanefawzi@gmail.com",  // Remplace par l'adresse de l'utilisateur
            subject: "Nouveau ticket créé",
            text: `Un nouveau ticket a été créé par ${req.body.name}.\n\nContenu: ${req.body.content}`
            
        });

        res.json({ status: 200, message: "Ticket créé avec succès et email envoyé !" });
    } catch (err) {
        console.error("Erreur lors de la création du ticket:", err);
        res.status(500).json({ status: 404, error: "Erreur lors de la création du ticket." });
    }
});

tickets.post('/addMessages', (req, res, next) => {
    console.log(req.body);
    Ticket.updateOne(
        { "_id": req.body.id },
        { $push: { messages: { text: req.body.messages } } },
        function (err, row) {
            if (err) {
                res.json({ error: err });
            } else {
                res.json({ code: 1, message: row });
            }
        }
    );
});

tickets.put('/changeStatus', function (req, res, next) {
    Ticket.findByIdAndUpdate(
        { _id: ObjectId(req.body.id) },
        { $set: { 'status': req.body.status } },
        { new: true },
        function (err) {
            if (err) {
                res.json({ error: err });
            } else {
                res.json("Statut mis à jour avec succès !");
            }
        }
    );
});

tickets.post('/filterStatus', (req, res) => {
    Ticket.find({ status: req.body.status }, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).json({ error: "Erreur lors du filtrage des tickets." });
        } else {
            res.json(items);
        }
    });
});

module.exports = tickets;

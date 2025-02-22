//index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoutes.js');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb+srv://chabaanefawzi:MP25yFYXnsA7FpLf@fawzi.ckwxg.mongodb.net/ticketDB', {
    serverSelectionTimeoutMS: 5000, // Temps d'attente pour la sélection du serveur
    socketTimeoutMS: 45000, // Temps d'attente pour les opérations de socket
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use('/api', ticketRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Database configuration
const dbConfig = {
    user: 'sava.mihnea',
    password: 'savamihnea',
    server: 'PARAMOUNT',
    database: 'HotelManagement',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

// Connect to the database
sql.connect(dbConfig, err => {
    if (err) {
        console.log('Database connection failed: ', err);
    } else {
        console.log('Connected to the database!');
    }
});

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const request = new sql.Request();
    request.query(`SELECT * FROM Users WHERE Username = '${username}' AND Password = '${password}'`, (err, result) => {
        if (err) {
            console.log('Error fetching user: ', err);
            res.status(500).send({ success: false });
        } else if (result.recordset.length > 0) {
            res.send({ success: true });
        } else {
            res.send({ success: false });
        }
    });
});


// Register form
app.post('/register', (req, res) => {
    const { name, age, email, username, password } = req.body;

    const request = new sql.Request();
    request.query(`INSERT INTO Users (Name, Age, Email, Username, Password)
                   VALUES ('${name}', ${age}, '${email}', '${username}', '${password}')`,
        (err, result) => {
            if (err) {
                console.log('Error registering user: ', err);
                res.status(500).send({ success: false });
            } else {
                res.send({ success: true });
            }
        });
});

// Route to fetch all bookings for user
app.post('/getUserBookings', (req, res) => {
    const { username } = req.body;

    const request = new sql.Request();
    request.query(`SELECT * FROM Bookings WHERE Name = (SELECT Name FROM Users WHERE Username = '${username}')`, (err, result) => {
        if (err) {
            console.log('Error fetching bookings: ', err);
            res.status(500).send([]);
        } else {
            res.json(result.recordset);
        }
    });
});

// Route to fetch all bookings for admin
app.get('/getBookings', (req, res) => {
    const request = new sql.Request();
    request.query('SELECT * FROM Bookings', (err, result) => {
        if (err) {
            console.log('Error fetching bookings: ', err);
            res.status(500).send('Error fetching bookings.');
        } else {
            res.json(result.recordset);
        }
    });
});

// Route to handle booking submissions
app.post('/booking', (req, res) => {
    const { name, email, age, numberOfPeople, checkin, checkout, singleRooms, doubleRooms, tripleRooms, apartmentRooms } = req.body;

    const request = new sql.Request();
    request.query(`INSERT INTO Bookings (Name, Email, Age, NumberOfPeople, CheckInDate, CheckOutDate, SingleRooms, DoubleRooms, TripleRooms, ApartmentRooms)
                   VALUES ('${name}', '${email}', ${age}, ${numberOfPeople}, '${checkin}', '${checkout}', ${singleRooms}, ${doubleRooms}, ${tripleRooms}, ${apartmentRooms})`,
        (err, result) => {
            if (err) {
                console.log('Error inserting booking: ', err);
                res.status(500).send('Error inserting booking.');
            } else {
                res.send('Booking successful.');
            }
        });
});

// Route to delete a booking
app.delete('/deleteBooking', (req, res) => {
    const { id } = req.body;

    const request = new sql.Request();
    request.query(`DELETE FROM Bookings WHERE Id = ${id}`, (err, result) => {
        if (err) {
            console.log('Error deleting booking: ', err);
            res.status(500).send('Error deleting booking.');
        } else {
            res.send('Booking deleted.');
        }
    });
});

// Route to modify a booking
app.put('/modifyBooking', (req, res) => {
    const { id, name, email, age, numberOfPeople, checkin, checkout, singleRooms, doubleRooms, tripleRooms, apartmentRooms } = req.body;

    const request = new sql.Request();
    request.query(`UPDATE Bookings SET Name = '${name}', Email = '${email}', Age = ${age}, NumberOfPeople = ${numberOfPeople}, CheckInDate = '${checkin}', CheckOutDate = '${checkout}', SingleRooms = ${singleRooms}, DoubleRooms = ${doubleRooms}, TripleRooms = ${tripleRooms}, ApartmentRooms = ${apartmentRooms} WHERE Id = ${id}`,
        (err, result) => {
            if (err) {
                console.log('Error modifying booking: ', err);
                res.status(500).send('Error modifying booking.');
            } else {
                res.send('Booking modified.');
            }
        });
});

// Error handling for port in use
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/home.html`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying another port...`);
        app.listen(3001, () => {
            console.log(`Server running at http://localhost:3001/home.html`);
        });
    } else {
        console.error(err);
    }
});

// Route to get booking
app.get('/getBookingById/:id', (req, res) => {
    const { id } = req.params;

    const request = new sql.Request();
    request.query(`SELECT * FROM Bookings WHERE Id = ${id}`, (err, result) => {
        if (err) {
            console.log('Error fetching booking: ', err);
            res.status(500).send('Error fetching booking.');
        } else {
            res.json(result.recordset[0]);
        }
    });
});

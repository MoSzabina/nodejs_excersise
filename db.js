// db.js - Sablon modul adatok lekéréséhez

const mysql = require("mysql2");

/**
 * SABLON: Adatok lekérése
 * @param {function} callback - function(rows) - a lekérdezett adatok tömbje
 */
function getData(callback) {
    // SABLON: állítsd be a saját adatbázis paramétereidet
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "" // IDE: adatbázis neve
    });

    con.connect(err => {
        if (err) throw err;

        // SABLON: cseréld a lekérdezést a saját tábla/mező struktúrádra
        const QUERY = "SELECT * FROM my_table"; 

        con.query(QUERY, (err, rows) => {
            if (err) throw err;

            // Csak a nyers adatokat adjuk vissza, HTML generálás nélkül
            callback(rows);

            con.end();
        });
    });
}

module.exports = { getData };

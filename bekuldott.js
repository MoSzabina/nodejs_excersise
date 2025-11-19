// bekuldott.js - Sablon modul a beküldött üzenetek lekéréséhez

const mysql = require("mysql2");

/**
 * SABLON: Kapcsolati üzenetek lekérése
 * @param {function} callback - function(rows) - a lekérdezett adatok tömbje
 */
function getKapcsolat(callback) {
    // SABLON: állítsd be a saját adatbázis paramétereidet
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "" // IDE: adatbázis neve
    });

    con.connect(err => {
        if (err) throw err;

        // SABLON: tábla neve és lekérdezés
        con.query("SELECT * FROM kapcsolat ORDER BY id DESC;", (err, rows) => {
            if (err) throw err;

            // Csak a nyers adatokat adjuk vissza, HTML generálás nélkül
            callback(rows);

            con.end();
        });
    });
}

module.exports = { getKapcsolat };

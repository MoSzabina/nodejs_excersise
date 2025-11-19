// uzenetKuldes.js - Sablon modul POST űrlapok beküldéséhez

const mysql = require("mysql2");
const qs = require("querystring");

/**
 * SABLON: Hozd létre a saját adatbázis kapcsolatot
 */
function createDbConnection() {
    return mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "" // IDE: adatbázis neve
    });
}

/**
 * SABLON: űrlap adatainak feldolgozása
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function uzenetKuldes(req, res) {
    if (req.method !== "POST") {
        res.writeHead(405, { "Content-Type": "text/plain" });
        res.end("Nem támogatott HTTP metódus.");
        return;
    }

    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
        const formData = qs.parse(body);

        const con = createDbConnection();
        con.connect(err => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Hiba az adatbázishoz való csatlakozás során.");
                return;
            }

            // SABLON: cseréld a táblanevet és a mezőket a saját projekted szerint
            const TABLE_NAME = "my_table";
            const columns = Object.keys(formData).join(", ");
            const placeholders = Object.keys(formData).map(_ => "?").join(", ");
            const values = Object.values(formData);

            const sql = `INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${placeholders})`;

            con.query(sql, values, (err) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" });
                    res.end("Adatbázis hiba.");
                } else {
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Sikeres beküldés!");
                }
                con.end();
            });
        });
    });
}

module.exports = { uzenetKuldes };

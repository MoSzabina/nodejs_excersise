// crud.js - Sablon CRUD modul Node.js/Express-hez (MySQL)

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
 * SABLON: CRUD műveletek
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
function crud(req, res) {
    const con = createDbConnection();
    con.connect(err => {
        if (err) {
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("HIBA: nem lehet kapcsolódni az adatbázishoz");
            return;
        }

        // SABLON: cseréld a táblaneveket a saját projekted szerint
        const TABLE_NAME = "my_table"; // IDE: táblanév
        const PRIMARY_KEY = "id";      // IDE: elsődleges kulcs neve

        const urlParts = req.url.split("/");

        // GET: összes rekord lekérése
        if (req.method === "GET" && urlParts[1] === "crud") {
            con.query(`SELECT * FROM ${TABLE_NAME}`, (err, results) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Hiba a rekordok lekérése során");
                    return;
                }
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
                con.end();
            });
        }

        // POST: új rekord létrehozása
        else if (req.method === "POST" && urlParts[1] === "crud") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const parsedBody = qs.parse(body);
                // SABLON: cseréld a mezőneveket a saját táblád szerint
                const fieldValues = parsedBody;

                // Generikus beszúrás
                const columns = Object.keys(fieldValues).join(", ");
                const placeholders = Object.keys(fieldValues).map(_ => "?").join(", ");
                const values = Object.values(fieldValues);

                con.query(`INSERT INTO ${TABLE_NAME} (${columns}) VALUES (${placeholders})`, values, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Rekord létrehozása sikertelen");
                        return;
                    }
                    res.writeHead(201);
                    res.end("Rekord létrehozva");
                    con.end();
                });
            });
        }

        // PUT: rekord frissítése
        else if (req.method === "PUT" && urlParts[1] === "crud") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const parsedBody = qs.parse(body);
                const id = parsedBody[PRIMARY_KEY];
                if (!id) {
                    res.writeHead(400);
                    res.end("Hiányzó elsődleges kulcs");
                    return;
                }

                const updates = Object.keys(parsedBody)
                    .filter(k => k !== PRIMARY_KEY)
                    .map(k => `${k} = ?`).join(", ");
                const values = Object.keys(parsedBody)
                    .filter(k => k !== PRIMARY_KEY)
                    .map(k => parsedBody[k]);
                values.push(id);

                con.query(`UPDATE ${TABLE_NAME} SET ${updates} WHERE ${PRIMARY_KEY} = ?`, values, (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Rekord frissítése sikertelen");
                        return;
                    }
                    res.writeHead(200);
                    res.end("Rekord frissítve");
                    con.end();
                });
            });
        }

        // DELETE: rekord törlése
        else if (req.method === "DELETE" && urlParts[1] === "crud") {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => {
                const parsedBody = qs.parse(body);
                const id = parsedBody[PRIMARY_KEY];
                if (!id) {
                    res.writeHead(400);
                    res.end("Hiányzó elsődleges kulcs");
                    return;
                }

                con.query(`DELETE FROM ${TABLE_NAME} WHERE ${PRIMARY_KEY} = ?`, [id], (err) => {
                    if (err) {
                        res.writeHead(500);
                        res.end("Rekord törlése sikertelen");
                        return;
                    }
                    res.writeHead(200);
                    res.end("Rekord törölve");
                    con.end();
                });
            });
        }

        // Nem támogatott módszer
        else {
            res.writeHead(405);
            res.end("Nem támogatott művelet");
            con.end();
        }
    });
}

module.exports = { crud };

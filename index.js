import express from "express"
import bodyParser from "body-parser"
import pg from "pg"
import axios from "axios"

const app = express()
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "BookLibrary",
    password: "victory",
    port: 5432
});
db.connect();

app.use(
    bodyParser.urlencoded({ extended: true })
)
app.use(express.static("public"))

app.get("/", async (req,res) =>{
    try {
        res.render("index.ejs")
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
    }
})

app.post(`/`, async (req,res) =>{
    try {
        const { bookTitle, bookDescription, dateRead, scale } = req.body;
        const value = req.body.isbn
    
        const response = await axios.get(`https://covers.openlibrary.org/b/isbn/${value}-M.jpg`);
        const result = response.data;

        // await db.query(
        //     `
        //     INSERT INTO books (title, description, date_read, scale, isbn, cover_url)
        //     VALUES ($1, $2, $3, $4, $5, $6)
        //     RETURNING *;
        //     `, [bookTitle, bookDescription, dateRead,scale,value,coverUrl]
        // )

        // const newBook = db.rows[0];

    //     const insertQuery = `
    //         INSERT INTO books (title, description, date_read, scale, isbn, cover_url)
    //         VALUES ($1, $2, $3, $4, $5, $6)
    //         RETURNING *;`;

    //   const values = [bookTitle, bookDescription, dateRead, scale, isbn, coverUrl];
  
    //   const dbResponse = await db.query(insertQuery, values);
    //   const newBook = dbResponse.rows[0];


        res.render("index.ejs",{
            data: {
                bookTitle: bookTitle,
                bookDescription: bookDescription,
                dateRead: dateRead,
                scale: scale,
                coverUrl: result
            }

            // data: newBook
        })
    } catch (error) {
        console.error("Failed to make request:", error.message);
        res.render("index.ejs", {
          error: error.message,
        });
    }
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});  
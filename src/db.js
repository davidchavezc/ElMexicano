import pg from 'pg';

export const pool = new pg.Pool({
    user: "postgres", //usuario que tengas en postgre
    host: "localhost",
    password: "Superman19", //password que utilizas en postgre
    database: "ElMexicano", // nombre de la database
    port: "5432"
})

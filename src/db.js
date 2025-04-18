import pg from 'pg'

export const pool = new pg.Pool({
    user: "", //usuario que tengas en postgre
    host: "localhost",
    password: "", //password que utilizas en postgre
    database: "", // nombre de la database
    port: "5432"
})
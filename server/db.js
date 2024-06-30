var mysql = require("mysql");

const con = mysql.createConnection({
    host: process.env.GOOGLE_SQL_HOST,
    user: "root",
    password: process.env.GOOGLE_SQL_PASSWORD,
    database: "watstudy",
});

con.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("connected!");
    }
});

const getOne = async (sql, arr = []) => {
    return new Promise((resolve, reject) => {
        con.query(sql, arr, (error, result) => {
            if (error) return reject(error);
            else {
                console.log("the result ", result);
                return result.length
                    ? resolve(JSON.parse(JSON.stringify(result[0])))
                    : resolve(null);
            }
        });
    });
};

function query(sql, arg1, arg2 = null) {
    if (arg2) {
        con.query(sql, arg1, arg2);
    } else {
        con.query(sql, arg1);
    }
}

module.exports = {
    query,
    getOne
};

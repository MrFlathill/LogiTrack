require('dotenv').config();
const { Database } = require('../shared/sqlClasses.js');

const connectionProperties = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function getAllImagess(sort = null) {
    const sql = `
    SELECT *
    FROM typeValues
    ORDER BY iid ${!sort || sort === "asc" ? "ASC" : "DESC"};
    `;
    try {
        const database = new Database(connectionProperties);
        const result = await database.queryClose(sql);
        console.log("getAllImagess");
        return result.length === 0 ?
            Promise.reject("No Values found") :
            Promise.resolve(result);
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function getImageByValues(iid, ttype) {
    if (iid != null && ttype != null) {
        const sql = `
        SELECT *
        FROM typeValues
        WHERE iid = ? AND ttype = ?;
        `;
        try {
            const database = new Database(connectionProperties);
            const result = await database.queryClose(sql, [iid, ttype]);
            console.log("getImageByValues iid type");
            if (result.length === 0) {
                return Promise.reject("Value not found");
            } else {
                return Promise.resolve(result[0]);
            }
        } catch (error) {
            return Promise.reject("Database error");
        }
    } else if (!iid && ttype !=null) {
        const sql = `
        SELECT *
        FROM typeValues
        WHERE ttype = ?;
        `;
        try {
            const database = new Database(connectionProperties);
            const result = await database.queryClose(sql, [ttype]);
            console.log("getImageByValues type");
            if (result.length === 0) {
                return Promise.reject("Value not found");
            } else {
                return Promise.resolve(result[0]);
            }
        } catch (error) {
            return Promise.reject("Database error");
        }
    } else if (iid != null && !ttype) {
        const sql = `
        SELECT *
        FROM typeValues
        WHERE iid = ?;
        `;
        try {
            const database = new Database(connectionProperties);
            const result = await database.queryClose(sql, [iid]);
            console.log("getImageByValues iid");
            if (result.length === 0) {
                return Promise.reject("Value not found");
            } else {
                return Promise.resolve(result[0]);
            }
        } catch (error) {
            return Promise.reject("Database error");
        }
    } else {
        console.log("no Information provided");
        return Promise.reject("Error in Logic");
    }
}

async function insertTypeValues(typeValue) {
    try {
        const database = new Database(connectionProperties);

        const sql = `INSERT INTO typeValues(iid, ttype, tvalue) VALUES(?,?,?) `;
        const result = await database.queryClose(sql, [
            typeValue.iid,
            typeValue.ttype,
            typeValue.tvalue
        ]);
        console.log("insertTypeValues");
        if (result.affectedRows === 0) {
            return Promise.reject("Image not added");
        } else {
            const insertedId = result.insertId; // Die ID des eingefügten Datensatzes
            return Promise.resolve(
                "TypeValue has been added successfully with ID: " + insertedId
            );
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("Database error");
    }
}

async function updateTypeValues(typeValue) {
    try {
        const database = new Database(connectionProperties);

        const sql = `SELECT iid,ttype FROM typeValues`;
        const result2 = await database.query(sql);
        if (result2.find(i => i.iid === typeValue.iid && i.ttype === typeValue.ttype)) {
            const sqlupdate = `
            UPDATE images SET tvalue=?
            WHERE iid = ? AND ttype = ?
            `;
            const result = await database.queryClose(sqlupdate, [
                typeValue.tvalue,
                typeValue.iid,
                typeValue.ttype
            ]);
            console.log("updateTypeValues");
            if (result.affectedRows === 0) {
                return Promise.reject("TypeValue not changed");
            } else {
                return Promise.resolve(
                    "ImTypeValue age with iid: " + typeValue.iid + " and ttype: " + typeValue.ttype + " has been changed successfully!"
                );
            }

        }
        console.log("no Item with this iid detected");
        return Promise.reject("no Item with this iid detected");
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function deleteTypeValues(iid) {
    try {
        const database = new Database(connectionProperties);
        const sql = `DELETE FROM typeValues WHERE iid = ?`;
        const result = await database.queryClose(sql, [iid]);
        console.log("deleteTypeValues");
        if (result.affectedRows === 0) {
            return Promise.reject("TypeValue not found");
        } else {
            return Promise.resolve(
                "Image with iid: " + iid + " has been deleted sucessfully!"
            );
        }
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function deleteTypeValue(iid, ttype) {
    try {
        const database = new Database(connectionProperties);
        const sql = `DELETE FROM typeValues WHERE iid = ? AND ttype = ?`;
        const result = await database.queryClose(sql, [iid, ttype]);
        console.log("deleteTypeValue");
        if (result.affectedRows === 0) {
            return Promise.reject("TypeValue not found");
        } else {
            return Promise.resolve(
                "Image with iid: " + iid + " and " + ttype + "has been deleted sucessfully!"
            );
        }
    } catch (error) {
        return Promise.reject("Database error");
    }
}


module.exports = {
    getImageByValues,
    getAllImagess,
    insertTypeValues,
    updateTypeValues,
    deleteTypeValues,
    deleteTypeValue,
};
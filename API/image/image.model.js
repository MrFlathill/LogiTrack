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
    FROM images
    ORDER BY itimestamp ${!sort || sort === "asc" ? "ASC" : "DESC"};
    `;
    try {
        const database = new Database(connectionProperties);
        const result = await database.queryClose(sql);
        console.log("getAllImagess");
        return result.length === 0 ?
            Promise.reject("No Images found") :
            Promise.resolve(result);
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function getImageById(iid) {
    const sql = `
    SELECT *
    FROM images
    WHERE iid = ?;
    `;
    try {
        const database = new Database(connectionProperties);
        const result = await database.queryClose(sql, [iid]);
        console.log("getImageById");
        if (result.length === 0) {
            return Promise.reject("Image not found");
        } else {
            return Promise.resolve(result[0]);
        }
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function insertImage(image) {
    try {
        const database = new Database(connectionProperties);

        const sql = `INSERT INTO images(iblob, itimestamp, ilat, ilong) VALUES(?,?,?,?) `;
        const result = await database.queryClose(sql, [
            image.iblob,
            image.itimestamp,
            image.ilat,
            image.ilong,
        ]);
        console.log("insertImage");
        if (result.affectedRows === 0) {
            return Promise.reject("Image not added");
        } else {
            const insertedId = result.insertId; // Die ID des eingefügten Datensatzes
            return Promise.resolve(
                "Image has been added successfully with ID: " + insertedId
            );
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("Database error");
    }
}

async function updateImage(image) {
    try {
        const database = new Database(connectionProperties);

        const sql = `SELECT iid FROM images`;
        const result2 = await database.query(sql);
        if (result2.find(i => i.iid === image.iid)) {
            const sqlupdate = `
            UPDATE images SET iblob=?,itimestamp=?,ilat=?,ilong=?
            WHERE iid = ?
            `;
            const result = await database.queryClose(sqlupdate, [
                image.iblob,
                image.itimestamp,
                image.ilat,
                image.ilong,
                image.iid,
            ]);
            console.log("updateImage");
            if (result.affectedRows === 0) {
                return Promise.reject("Image not changed");
            } else {
                return Promise.resolve(
                    "Image with iid: " + image.iid + " has been changed successfully!"
                );
            }

        }
        console.log("no Item with this iid detected");
        return Promise.reject("no Item with this iid detected");
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function deleteImage(iid) {
    try {
        const database = new Database(connectionProperties);
        const sql = `DELETE FROM images WHERE iid = ?`;
        const result = await database.queryClose(sql, [iid]);
        console.log("deleteImage");
        if (result.affectedRows === 0) {
            return Promise.reject("Image not found");
        } else {
            return Promise.resolve(
                "Image with iid: " + iid + " has been deleted sucessfully!"
            );
        }
    } catch (error) {
        return Promise.reject("Database error");
    }
}


module.exports = {
    getAllImagess,
    getImageById,
    insertImage,
    updateImage,
    deleteImage,
};
require('dotenv').config();
const { Database } = require('../shared/sqlClasses.js');

const connectionProperties = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function getAllCompanys(sort = null) {
    const sql = `
    SELECT *
    FROM companys
    ORDER BY cname ${!sort || sort === "asc" ? "ASC" : "DESC"};
    `;
    try {
        const database = new Database(connectionProperties);
        const result = await database.queryClose(sql);
        console.log("getAllCompanys");
        return result.length === 0 ?
            Promise.reject("No companys found") :
            Promise.resolve(result);
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function getCompanysById(cid) {
    const sql = `
    SELECT *
    FROM companys
    WHERE cid = ?;
    `;
    try {
        const database = new Database(connectionProperties);
        const result = await database.queryClose(sql, [cid]);
        if (result.length === 0) {
            return Promise.reject("Company not found");
        } else {
            return Promise.resolve(result[0]);
        }
    } catch (error) {
        return Promise.reject("Database error");
    }
}

async function insertCompany(company) {
    try {
        const database = new Database(connectionProperties);

        const sql2 = `SELECT cname FROM companys`;
        const result2 = await database.query(sql2);
        if (result2.find(i => i.cname === company.cname)) {
            console.log("duplicate Name detected");
            return Promise.reject("Name already used, try something else ;)");
        }
        const sql = `INSERT INTO companys(cname, caddress, ctelephone, cmail) VALUES(?,?,?,?) `;
        const result = await database.queryClose(sql, [
            company.cname,
            company.caddress,
            company.ctelephone,
            company.cmail,
        ]);
        console.log("insertCompany");
        if (result.affectedRows === 0) {
            return Promise.reject("Comapny not added");
        } else {
            return Promise.resolve(
                "Company  " + company.cname + " has been added successfully!"
            );
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("Database error");
    }
}

async function updateCompany(company) {
    try {
        const database = new Database(connectionProperties);

        const sql = `SELECT cid FROM companys`;
        const result2 = await database.query(sql);
        if (result2.find(i => i.cid === company.cid)) {
            const sqlupdate = `
            UPDATE companys SET cname=?,caddress=?,ctelephone=?,cmail=?
            WHERE cid = ?
            `;
            const result = await database.queryClose(sqlupdate, [
                company.cname,
                company.caddress,
                company.ctelephone,
                company.cmail,
                company.cid,
            ]);
            console.log("updateCompany");
            if (result.affectedRows === 0) {
                return Promise.reject("Company not changed");
            } else {
                return Promise.resolve(
                    "Company " + company.cid + " has been changed successfully!"
                );
            }

        }
        console.log("no Item with this CID detected");
        return Promise.reject("no Item with this CID detected");
    } catch (error) {
        console.error(error);
        return Promise.reject("Database error");
    }
}

async function deleteCompany(cid) {
    try {
        const database = new Database(connectionProperties);
        const sql = `DELETE FROM companys WHERE cid = ?`;
        const result = await database.queryClose(sql, [cid]);
        console.log("deleteCompany " + cid);
        if (result.affectedRows === 0) {
            return Promise.reject("Company not found");
        } else {
            console.log("Success")
            return Promise.resolve(
                "Company with cid: " + cid + " has been deleted sucessfully!"
            );
        }
    } catch (error) {
        console.error(error);
        return Promise.reject("Database error");
    }
}


module.exports = {
    getAllCompanys,
    getCompanysById,
    insertCompany,
    updateCompany,
    deleteCompany,
};
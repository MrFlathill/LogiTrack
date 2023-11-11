const companyModel = require("./company.model");
const jsonXml = require("jsontoxml");

function listCompanysAction(request, response) {
    const sort = request.query.sort ? request.query.sort : "";
    console.log(request.params.cid);
    companyModel
        .getAllCompanys(sort)
        .then((company) =>
            response.format({
                "application/xml": () => {
                    company = company.map((company) => ({ company }));
                    response.send(`<company>${jsonXml(company)}</company>`);
                },
                "application/json": () => response.json(company),
                default: () => response.json(company),
            })
        )
        .catch((error) =>
            response.format({
                "application/xml": () =>
                    response.status(error === "Database error" ? 500 : 400).send(error),
                "application/json": () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
                default: () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
            })
        );
}

function viewCompanyAction(request, response) {
    companyModel
        .getCompanysById(request.params.cid)
        .then((bottom) =>
            response.format({
                "application/xml": () => response.send(`<company>${jsonXml(bottom)}</company>`),
                "application/json": () => response.json(bottom),
                default: () => response.json(bottom),
            }))
        .catch((error) =>
            response.format({
                "application/xml": () =>
                    response.status(error === "Database error" ? 500 : 400).send(error),
                "application/json": () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
                default: () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
            })
        );
}

function insertCompanyAction(request, response) {
    const company = {
        cid: parseInt(request.body.cid, 10),
        cname: request.body.cname,
        caddress: request.body.caddress,
        ctelephone: request.body.ctelephone,
        cmail: request.body.cmail,
    };
    companyModel
        .insertCompany(company)
        .then((res) =>
            response.format({
                "application/xml": () => response.status(201).send(res),
                "application/json": () => response.status(201).json(res),
                default: () => response.status(201).json(res),
            }))
        .catch((error) =>
            response.format({
                "application/xml": () =>
                    response.status(error === "Database error" ? 500 : 400).send(error),
                "application/json": () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
                default: () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
            }));
}

function updateCompanyAction(request, response) {
    const company = {
        cid: parseInt(request.body.cid, 10),
        cname: request.body.cname,
        caddress: request.body.caddress,
        ctelephone: request.body.ctelephone,
        cmail: request.body.cmail,
    };
    companyModel
        .updateCompany(company)
        .then((res) =>
            response.format({
                "application/xml": () => response.send(res),
                "application/json": () => response.json(res),
                default: () => response.json(res),
            }))
        .catch((error) =>
            response.format({
                "application/xml": () =>
                    response.status(error === "Database error" ? 500 : 400).send(error),
                "application/json": () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
                default: () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
            }));
}

function removeCompanyAction(request, response) {
    companyModel
        .deleteCompany(request.params.cid)
        .then((res) =>
            response.format({
                "application/xml": () => response.send(res),
                "application/json": () => response.json(res),
                default: () => response.json(res),
            }))
        .catch((error) =>
            response.format({
                "application/xml": () =>
                    response.status(error === "Database error" ? 500 : 400).send(error),
                "application/json": () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
                default: () =>
                    response.status(error === "Database error" ? 500 : 400).json(error),
            })
        );
}

module.exports = {
    listCompanysAction,
    viewCompanyAction,
    insertCompanyAction,
    updateCompanyAction,
    removeCompanyAction,
}
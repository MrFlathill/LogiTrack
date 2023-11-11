const typeValuesModel = require("./typeValues.model");
const jsonXml = require("jsontoxml");

function listTypeValuesAction(request, response) {
    const sort = request.query.sort ? request.query.sort : "";
    const imageID = request.query.iid ? request.query.iid : null;
    const valueType = request.query.ttype ? request.query.ttype : null;
    if (imageID != null && valueType != null || imageID != null && !valueType || !imageID && valueType != null) {
        typeValuesModel
            .getValuesByValue(imageID, valueType)
            .then((images) =>
                response.format({
                    "application/xml": () => {
                        images = images.map((image) => ({ image }));
                        response.send(`<images>${jsonXml(images)}</images>`);
                    },
                    "application/json": () => response.json(images),
                    default: () => response.json(images),
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
    } else {
        typeValuesModel
            .getAllValues(sort)
            .then((images) =>
                response.format({
                    "application/xml": () => {
                        images = images.map((image) => ({ image }));
                        response.send(`<images>${jsonXml(images)}</images>`);
                    },
                    "application/json": () => response.json(images),
                    default: () => response.json(images),
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
}

function insertTypeValuesAction(request, response) {
    const typeValues = {
        iid: parseInt(request.body.iid, 10),
        ttype: request.body.ttype,
        tvalue: request.body.tvalue,
    };
    typeValuesModel
        .insertImage(typeValues)
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

function updateTypeValuesAction(request, response) {
    const typeValues = {
        iid: parseInt(request.body.iid, 10),
        ttype: request.body.ttype,
        tvalue: request.body.tvalue,
    };
    console.log("success");
    typeValuesModel
        .updateImage(typeValues)
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

function removeTypeValuesAction(request, response) {
    const imageID = request.query.iid ? request.query.iid : null;
    const valueType = request.query.ttype ? request.query.ttype : null;
    typeValuesModel
        .deleteTypeValues(imageID, valueType)
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
    listTypeValuesAction,
    insertTypeValuesAction,
    updateTypeValuesAction,
    removeTypeValuesAction,
}
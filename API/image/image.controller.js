const imageModel = require("./image.model");
const jsonXml = require("jsontoxml");

function listImagesAction(request, response) {
    const sort = request.query.sort ? request.query.sort : "";
    imageModel
        .getAllImagess(sort)
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

function viewImageAction(request, response) {
    imageModel
        .getImageById(request.params.iid)
        .then((image) =>
            response.format({
                "application/xml": () => response.send(`<image>${jsonXml(image)}</image>`),
                "application/json": () => response.json(image),
                default: () => response.json(image),
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

function insertImageAction(request, response) {
    const image = {
        iid: parseInt(request.body.iid, 10),
        iblob: request.body.iblob,
        itimestamp: parseInt(request.body.itimestamp, 10),
        ilat: parseFloat(request.body.ilat),
        ilong: parseFloat(request.body.ilong),
    };
    imageModel
        .insertImage(image)
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

function updateImageAction(request, response) {
    const image = {
        iid: parseInt(request.body.iid, 10),
        iblob: request.body.iblob,
        itimestamp: parseInt(request.body.itimestamp, 10),
        ilat: parseFloat(request.body.ilat),
        ilong: parseFloat(request.body.ilong),
    };
    console.log("success");
    imageModel
        .updateImage(image)
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

function removeImageAction(request, response) {
    imageModel
        .deleteImage(request.params.iid)
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
    listImagesAction,
    viewImageAction,
    insertImageAction,
    updateImageAction,
    removeImageAction,
}
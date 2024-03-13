const express = require("express");
const router = express.Router();

const galleryCtrl = require("../controller/Gallery");

router.post("/", galleryCtrl.add);
router.delete("/:id", galleryCtrl.delete);
router.put("/:id", galleryCtrl.update);
router.get("/", galleryCtrl.getGallery);
router.get("/search", galleryCtrl.search);

module.exports = router;
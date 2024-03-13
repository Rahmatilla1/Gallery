const path = require("path")
const Gallery = require("../models/galleryModel")
const cloudinary = require("cloudinary")
const fs = require("fs")

const removeTemp = (path) => {
    fs.unlink(path, err => {
        if (err) {
            throw err
        }
    }) 
}
const galleryCtrl = {
    add: async(req, res) => {
        try {
        const {title} = req.body
        const {photo} = req.files
    
        const result = await cloudinary.v2.uploader.upload(photo.tempFilePath, {
            folder: 'GalleryApp'
        }, async (err, result)=> {
            if (err) {
                throw err
            }
            removeTemp(photo.tempFilePath)
    
            return result
        })
        const image = {url: result.secure_url, public_id: result.public_id}
    
        const newPhoto = await Gallery.create({title, image})
    
        res.status(201).send({message: "success", newPhoto})
    
        } catch (error) {
            res.status(503).send({message: error.message})
            console.log(error);
        }
    },
    delete: async (req, res) => {
        try {
            const {id} = req.params

            const photo = await Gallery.findById(id)

            if (photo) {
                let public_id = photo.image.public_id
                await cloudinary.v2.uploader.destroy(public_id, async (err) => {
                    if (err) {
                        throw err
                    }
                })
    
                await Gallery.findByIdAndDelete(id)
                res.status(200).send({message: "deleted", photo})
            } else {
                res.status(404).send({message: "not found"})
            }
    
        } catch (error) {
            res.status(503).send({message: error.message})
            console.log(error);
        }
    },
    update: async (req, res) => {
        const {id} = req.params
        try {
            const updatePic = await Gallery.findById(id)
            if (!updatePic) {
                res.status(404).send('Picture not found')
            }
            if (req.files) {
                const {image} = req.files;
                if (image) {
                    const format = image.mimetype.split('/')[1];
                    if (format !== 'png' && format !== 'jpeg') {
                        return res.status(403).json({message: "file format incorrect"})
                    } else if(image.size > 1000000) {
                        return res.status(403).json({message: "Image size must be less than (1) MB"})
                    }
                    const imagee = await cloudinary.v2.uploader.upload(image.tempFilePath, {
                        folder: 'Gallery'
                    }, async (err, result) => {
                        if(err) {
                            throw err
                        } else {
                            removeTemp(image.tempFilePath)
                            return result
                        }
                    })
                    if (updatePic.picture) {
                        await cloudinary.v2.uploader.destroy(updatePic.picture.public_id, async (err) => {
                            if (err) {
                                throw err
                            }
                        })
                    }
                    const imag = {public_id : imagee.public_id, url: imagee.secure_url}
                    req.body.image = imag;
                }
            }
            const pictureEd = await Gallery.findByIdAndUpdate(id, req.body, {new: true});
            return res.status(200).json({message: "Picture update successfully", picture: pictureEd})
        } catch (error) {
            res.status(503).send({message: error.message})
            console.log(error);
        }
    },
    getGallery: async(req, res) => {
        try {
            const albom = await Gallery.find()
            res.send({message: "all photos", albom})
        } catch (error) {
            res.status(503).send({message: error.message})
            console.log(error);
        }
    },
    search: async(req, res) => {
            const {title} = req.query;

            if (!title) {
                const photos = await Gallery.find();
                return res.status(200).send({message: "All photos", photos})
            }

            const key = new RegExp(title, "i");

            const result = await Gallery.find({
                $or: [{title: {$regex : key}}]
            })

            res.status(200).send({message: "Found photos", result})
    },
}

module.exports = galleryCtrl;
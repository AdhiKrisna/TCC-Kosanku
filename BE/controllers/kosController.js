import KosModel from '../models/kosModel.js';
import UserModel from '../models/userModel.js';
import KosImageModel from '../models/kosImageModel.js';
import bucket from '../config/gcs.js';


export async function getAllKos(req, res) {
    try {
        const kosList = await KosModel.findAll({
            include: {
                model: UserModel,
                as: 'owner',
                attributes: ['user_id', 'user_name', 'user_phone']
            }
        });
        res.status(200).json({
            status: "success",
            message: "Kos fetched successfully",
            data: kosList
        });
    } catch (error) {
        console.error("Error fetching kos:", error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
}

export async function getKosById(req, res) {
    const { id } = req.params;
    try {
        const kos = await KosModel.findByPk(id, {
            include: {
                model: UserModel,
                as: 'owner',
                attributes: ['user_id', 'user_name', 'user_phone']
            }
        });

        if (!kos) {
            return res.status(404).json({ status: "error", message: "Kos not found" });
        }

        res.status(200).json({
            status: "success",
            message: "Kos fetched successfully",
            data: kos
        });
    } catch (error) {
        console.error("Error fetching kos by ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getKosByOwnerId(req, res) {
    const { id } = req.params;
    try {
        const kosList = await KosModel.findAll({
            where: { owner_kos_id: id },
            include: {
                model: UserModel,
                as: 'owner',
                attributes: ['user_id', 'user_name', 'user_phone']
            }
        });
        if (kosList.length === 0) {
            return res.status(404).json({ status: "error", message: "No kos found for this owner" });
        }
        res.status(200).json({
            status: "success",
            message: "Kos fetched successfully",
            data: kosList
        });
    } catch (error) {
        console.error("Error fetching kos by owner ID:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


export async function createKos(req, res) {
    const {kos_name, kos_address, kos_description, kos_rules, category, link_gmaps, room_available, max_price, min_price, owner_kos_id, kos_latitude, kos_longitude } = req.body;
    // if except kos_description and kos_rules are required
    if (!kos_name || !kos_address || !category || !link_gmaps || room_available === undefined || max_price === undefined || min_price === undefined || !owner_kos_id || kos_latitude === undefined || kos_longitude === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Kos name, kos address, category, link_gmaps, room_available, max_price, min_price, owner_kos_id, latitude, and longitude are required"
        });
    }

    if (!req.files || req.files.length < 1) {
        return res.status(400).json({
            status: "error",
            message: "At least one image is required"
        });
    }

    try {
        const owner = await UserModel.findByPk(owner_kos_id);
        if (!owner) {
            return res.status(404).json({
                status: "error",
                message: "Owner not found"
            });
        }
        const newKos = await KosModel.create({
            kos_name,
            kos_address,
            kos_description,
            kos_rules,
            category,
            link_gmaps,
            room_available,
            max_price,
            min_price,
            owner_kos_id,
            kos_latitude,
            kos_longitude
        });

        const imagePromises = req.files.map(file => {
            return KosImageModel.create({
                kos_id: newKos.kos_id,
                image_url: file.gcsUrl // upload to cloud storage
            });
        });

        await Promise.all(imagePromises);

        res.status(201).json({
            status: "success",
            message: "Kos created successfully with images",
            data: newKos
        });
    } catch (error) {
        console.error("Error creating kos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateKos(req, res) {
    const { id } = req.params;
    const {kos_name, kos_address, kos_description, kos_rules, category, link_gmaps, room_available, max_price, min_price, kos_latitude, kos_longitude } = req.body;
    // if except kos_description and kos_rules are required
    if (!kos_name || !kos_address || !category || !link_gmaps || room_available === undefined || max_price === undefined || min_price === undefined || kos_latitude === undefined || kos_longitude === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Kos name, kos address, category, link_gmaps, room_available, max_price, min_price, latitude, and longitude are required"
        });
    }

    try {
        const kos = await KosModel.findByPk(id);
        if (!kos) {
            return res.status(404).json({
                status: "error",
                message: "Kos not found"
            });
        }

        // Update kos details
        kos.kos_name = kos_name;
        kos.kos_address = kos_address;
        kos.kos_description = kos_description;
        kos.kos_rules = kos_rules;
        kos.category = category;
        kos.link_gmaps = link_gmaps;
        kos.room_available = room_available;
        kos.max_price = max_price;
        kos.min_price = min_price;
        kos.kos_latitude = kos_latitude;
        kos.kos_longitude = kos_longitude;
        
        await kos.save();

        res.status(200).json({
            status: "success",
            message: "Kos updated successfully",
            data: kos
        });
    } catch (error) {
        console.error("Error updating kos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteKos(req, res) {
    const { id } = req.params;
    try {
        const kos = await KosModel.findByPk(id);
        if (!kos) {
            return res.status(404).json({ status: "error", message: "Kos not found" });
        }

        const images = await KosImageModel.findAll({
            where: { kos_id: id }
        });

        for (const image of images){
            const fileName = image.image_url.split(`/${bucket.name}/`)[1]; 
            console.log("Deleting image file:", fileName);
            try {
                await bucket.file(fileName).delete();
                console.log("Image file deleted successfully:", fileName);
            } catch (err) {
                console.error("Failed to delete image file from Cloud Storage:", err);
                return res.status(500).json({
                    status: "error",
                    message: "Failed to delete image file from Cloud Storage",
                    error: err.message
                });
            }
        }
        // Hapus semua gambar terkait kos sebelum menghapus kos
        await KosImageModel.destroy({
            where: { kos_id: id }
        });

        const name = kos.kos_name;
        await kos.destroy();
        res.status(200).json({
            status: "success",
            message: `Kos ${name} deleted successfully`
        });
    } catch (error) {
        console.error("Error deleting kos:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

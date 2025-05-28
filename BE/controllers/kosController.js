import KosModel from '../models/kosModel.js';
import UserModel from '../models/userModel.js';
import KosImageModel from '../models/kosImageModel.js';


export async function getAllKos(req, res) {
    try {
        const kosList = await KosModel.findAll({
            include: {
                model: UserModel,
                as: 'owner',
                attributes: ['user_id', 'user_name']
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

export async function createKos(req, res) {
    const { kos_name, kos_description, pemilik_kos_id, kos_latitude, kos_longitude } = req.body;

    if (!kos_name || !pemilik_kos_id || kos_latitude === undefined || kos_longitude === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Kos name, kos owner, latitude, and longitude are required"
        });
    }

    if (!req.files || req.files.length < 1) {
        return res.status(400).json({
            status: "error",
            message: "At least one image is required"
        });
    }

    try {
        const owner = await UserModel.findByPk(pemilik_kos_id);
        if (!owner) {
            return res.status(404).json({
                status: "error",
                message: "Owner not found"
            });
        }

        const newKos = await KosModel.create({
            kos_name,
            kos_description,
            pemilik_kos_id,
            kos_latitude,
            kos_longitude
        });

        const imagePromises = req.files.map(file => {
            return KosImageModel.create({
                kos_id: newKos.kos_id,
                image_url: file.path // gunakan file.location kalau pakai Cloudinary
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


export async function getKosById(req, res) {
    const { id } = req.params;
    try {
        const kos = await KosModel.findByPk(id, {
            include: {
                model: UserModel,
                as: 'owner',
                attributes: ['user_id', 'user_name']
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

export async function updateKos(req, res) {
    const { id } = req.params;
    const { kos_name, kos_description, pemilik_kos_id, kos_latitude, kos_longitude } = req.body;

    if (!kos_name || !pemilik_kos_id || kos_latitude === undefined || kos_longitude === undefined) {
        return res.status(400).json({
            status: "error",
            message: "Kos name, pemilik kos, latitude, and longitude are required"
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

        const owner = await UserModel.findByPk(pemilik_kos_id);
        if (!owner) {
            return res.status(404).json({
                status: "error",
                message: "Owner not found"
            });
        }

        kos.kos_name = kos_name;
        kos.kos_description = kos_description;
        kos.pemilik_kos_id = pemilik_kos_id;
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

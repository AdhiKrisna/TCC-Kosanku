import KosImageModel from "../models/kosImageModel.js";
import KosModel from "../models/kosModel.js";

//Read all images
export async function getAllKosImages(req, res) {
  try {
    const images = await KosImageModel.findAll();
    if (images.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "No images found"
      });
    }
    res.status(200).json({
      status: "success",
      message: "All images retrieved successfully",
      data: images
    });
  } catch (error) {
    console.error("Error fetching all kos images:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}
// Create
export async function createKosImage(req, res) {
  const { kosId } = req.params;  // ambil dari URL params
  const files = req.files;

  if (!kosId || !files || files.length === 0) {
    return res.status(400).json({
      status: "error",
      message: "kosId and at least 1 image files are required"
    });
  }

  try {
    const kos = await KosModel.findByPk(kosId);
    if (!kos) {
      return res.status(404).json({
        status: "error",
        message: "Kos not found"
      });
    }

    const savedImages = await Promise.all(
      files.map(file =>
        KosImageModel.create({
          kos_id: kosId,       // pake kosId dari param langsung
          image_url: file.path,
        })
      )
    );

    res.status(201).json({
      status: "success",
      message: "Image created successfully",
      data: savedImages,
    });
  } catch (error) {
    console.error("Error creating kos image:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}


// Read images by Kos ID
export async function getImagesByKosID(req, res) {
  const { kosId } = req.params;
  try {
    const images = await KosImageModel.findAll({
      where: { kos_id: kosId }
    });

    if (images.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Images not found for this Kos ID"
      });
    }
    res.status(200).json({
      status: "success",
      message: "Images retrieved successfully",
      data: images
    });
  } catch (error) {
    console.error("Error fetching images by Kos ID:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

// Update
export async function updateKosImage(req, res) {
  const { id } = req.params;
  // const { kos_id } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      status: "error",
      message: "Image file are required"
    });
  }

  try {
    const image = await KosImageModel.findByPk(id);
    if (!image) {
      return res.status(404).json({
        status: "error",
        message: "Image not found"
      });
    }
    image.image_url = file.path;
    await image.save();
    res.status(200).json({
      status: "success",
      message: "Image updated successfully",
      data: image
    });
  } catch (error) {
    console.error("Error updating kos image:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

// Delete
export async function deleteKosImage(req, res) {
  const { id } = req.params;
  try {
    const image = await KosImageModel.findByPk(id);
    if (!image) {
      return res.status(404).json({
        status: "error",
        message: "Image not found"
      });
    }

    await image.destroy();
    res.status(200).json({
      status: "success",
      message: "Image deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting kos image:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
}

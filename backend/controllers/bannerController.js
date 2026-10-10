import bannerModel from "../models/bannerModel.js";

// GET ACTIVE BANNERS - customer
const listBanners = async (req, res) => {
  try {
    const banners = await bannerModel
      .find({ isActive: true })
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// GET ALL BANNERS - admin
const adminListBanners = async (req, res) => {
  try {
    const banners = await bannerModel
      .find({})
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      banners,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// ADD BANNER
const addBanner = async (req, res) => {
  try {
    const {
      image,
      imagePublicId,
      badge,
      title,
      subtitle,
      buttonText,
      buttonLink,
      position,
      color,
      isActive,
      displayOrder,
    } = req.body;

    if (!image || !title) {
      return res.json({
        success: false,
        message: "Image and title are required",
      });
    }

    const banner = await bannerModel.create({
      image,
      imagePublicId,
      badge,
      title,
      subtitle,
      buttonText,
      buttonLink,
      position,
      color,
      isActive,
      displayOrder,
    });

    res.json({
      success: true,
      message: "Banner added successfully",
      banner,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE BANNER
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await bannerModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!banner) {
      return res.json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// DELETE BANNER
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await bannerModel.findByIdAndDelete(id);

    if (!banner) {
      return res.json({
        success: false,
        message: "Banner not found",
      });
    }

    res.json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


// TOGGLE ACTIVE
const toggleBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await bannerModel.findById(id);

    if (!banner) {
      return res.json({
        success: false,
        message: "Banner not found",
      });
    }

    banner.isActive = !banner.isActive;

    await banner.save();

    res.json({
      success: true,
      message: banner.isActive
        ? "Banner activated"
        : "Banner hidden",
      banner,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};


export {
  listBanners,
  adminListBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  toggleBanner,
};
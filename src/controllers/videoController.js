const { Video, Admin } = require('../models-sql');
const { isValidYouTubeUrl, convertToEmbedUrl, extractVideoId } = require('../utils/youtubeHelpers');

/**
 * @route   GET /api/content/videos
 * @desc    Get all active videos (public)
 * @access  Public
 */
const getPublicVideos = async (req, res, next) => {
  try {
    const videos = await Video.findAll({
      where: { is_active: true },
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'DESC']
      ],
      attributes: { exclude: ['created_by'] }
    });
    
    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/videos
 * @desc    Get all videos (admin)
 * @access  Private
 */
const getAllVideos = async (req, res, next) => {
  try {
    const videos = await Video.findAll({
      order: [
        ['display_order', 'ASC'],
        ['created_at', 'DESC']
      ],
      include: [{
        model: Admin,
        as: 'creator',
        attributes: ['name', 'email']
      }]
    });
    
    res.status(200).json({
      success: true,
      data: videos
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/admin/videos/:id
 * @desc    Get single video
 * @access  Private
 */
const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findByPk(req.params.id, {
      include: [{
        model: Admin,
        as: 'creator',
        attributes: ['name', 'email']
      }]
    });
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/admin/videos
 * @desc    Create new video with YouTube URL
 * @access  Private
 */
const createVideo = async (req, res, next) => {
  try {
    const {
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      youtubeUrl,
      category,
      tags,
      order = 0,
      isActive = true
    } = req.body;
    
    // Validate YouTube URL
    if (!youtubeUrl) {
      return res.status(400).json({
        success: false,
        message: 'YouTube URL is required'
      });
    }
    
    if (!isValidYouTubeUrl(youtubeUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid YouTube URL format'
      });
    }
    
    // Convert to embed URL and extract video ID
    const embedUrl = convertToEmbedUrl(youtubeUrl);
    const videoId = extractVideoId(youtubeUrl);
    
    // Parse tags if string
    const parsedTags = tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [];
    
    const video = await Video.create({
      title_fr: titleFr,
      title_en: titleEn,
      description_fr: descriptionFr,
      description_en: descriptionEn,
      youtube_url: embedUrl,
      youtube_video_id: videoId,
      category,
      tags: parsedTags,
      display_order: order,
      is_active: isActive,
      created_by: req.admin.id
    });
    
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/videos/:id
 * @desc    Update video details
 * @access  Private
 */
const updateVideo = async (req, res, next) => {
  try {
    let video = await Video.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    const {
      titleFr,
      titleEn,
      descriptionFr,
      descriptionEn,
      youtubeUrl,
      category,
      tags,
      order,
      isActive
    } = req.body;
    
    // Update fields
    if (titleFr !== undefined) video.title_fr = titleFr;
    if (titleEn !== undefined) video.title_en = titleEn;
    if (descriptionFr !== undefined) video.description_fr = descriptionFr;
    if (descriptionEn !== undefined) video.description_en = descriptionEn;
    if (category !== undefined) video.category = category;
    if (order !== undefined) video.display_order = order;
    if (isActive !== undefined) video.is_active = isActive;
    
    // If YouTube URL is being updated, validate and convert
    if (youtubeUrl !== undefined) {
      if (!isValidYouTubeUrl(youtubeUrl)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid YouTube URL format'
        });
      }
      video.youtube_url = convertToEmbedUrl(youtubeUrl);
      video.youtube_video_id = extractVideoId(youtubeUrl);
    }
    
    // Update tags
    if (tags !== undefined) {
      video.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    }
    
    await video.save();
    
    res.status(200).json({
      success: true,
      message: 'Video updated successfully',
      data: video
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/admin/videos/:id
 * @desc    Delete video
 * @access  Private
 */
const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findByPk(req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'Video not found'
      });
    }
    
    // Delete from database (no file cleanup needed for YouTube URLs)
    await video.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Video deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/admin/videos/reorder
 * @desc    Reorder videos
 * @access  Private
 */
const reorderVideos = async (req, res, next) => {
  try {
    const { videos } = req.body;
    
    if (!videos || !Array.isArray(videos)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid videos array'
      });
    }
    
    // Update order for each video
    const updatePromises = videos.map(({ id, order }) => 
      Video.update(
        { display_order: order },
        { where: { id } }
      )
    );
    
    await Promise.all(updatePromises);
    
    res.status(200).json({
      success: true,
      message: 'Videos reordered successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicVideos,
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo,
  reorderVideos
};

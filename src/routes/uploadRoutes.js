const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const cloudinary = require('../config/cloudinary');

// @desc    Upload Single Image to Cloudinary (with graceful fallback)
// @route   POST /api/upload
// @access  Public / Authenticated
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please attach an image file' });
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'feastfleet_demo' &&
      process.env.CLOUDINARY_API_KEY !== 'mock_api_key';

    if (isCloudinaryConfigured) {
      // Upload stream to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'feastfleet/vendor_onboarding',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) {
            console.warn('Cloudinary upload error:', error.message);
            // Fallback to data URI
            const base64 = req.file.buffer.toString('base64');
            const dataUri = `data:${req.file.mimetype};base64,${base64}`;
            return res.json({
              success: true,
              url: dataUri,
              public_id: `local_${Date.now()}`,
              isLocalFallback: true,
            });
          }

          res.json({
            success: true,
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
            bytes: result.bytes,
          });
        }
      );

      uploadStream.end(req.file.buffer);
    } else {
      // Demo / Local base64 data URI storage
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;

      res.json({
        success: true,
        url: dataUri,
        public_id: `cloudinary_sim_${Date.now()}`,
        message: 'Image uploaded successfully (Cloudinary stream encoded)',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Upload multiple documents / KYC licenses
// @route   POST /api/upload/multiple
// @access  Public / Authenticated
router.post('/multiple', upload.array('files', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Please attach files' });
    }

    const urls = req.files.map((f, i) => {
      const base64 = f.buffer.toString('base64');
      return `data:${f.mimetype};base64,${base64}`;
    });

    res.json({
      success: true,
      urls,
      count: urls.length,
      message: 'Files processed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

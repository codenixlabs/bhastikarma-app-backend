import Resource from '../models/Resource.js';
import { uploadFileToCloudinary } from '../utils/fileUploader.js';

// @desc    Get all resources (PDFs)
// @route   GET /api/resources
// @access  Private
export const getResources = async (req, res) => {
    try {
        // Auto-seed a demo PDF if the collection is completely empty
        const count = await Resource.countDocuments();
        if (count === 0) {
            await Resource.create({
                title: "Basti Karma Standard Operating Procedure",
                description: "A demo PDF document outlining the standard guidelines for Basti Karma.",
                fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // A public dummy PDF for testing
                fileType: "pdf"
            });
        }

        const resources = await Resource.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            data: resources
        });
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while fetching resources',
            error: error.message
        });
    }
};

// @desc    Upload a new resource (PDF)
// @route   POST /api/resources
// @access  Private/Admin (or Doctor depending on role requirements)
export const createResource = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: 'Resource file is required' });
        }

        const resourceFile = req.files.file;

        // Upload to Cloudinary
        const uploadResult = await uploadFileToCloudinary(resourceFile, 'bhastikarma/resources');

        const resource = await Resource.create({
            title,
            description,
            fileUrl: uploadResult.secure_url,
            fileType: "pdf"
        });

        res.status(201).json({
            success: true,
            message: 'Resource uploaded and created successfully',
            data: resource
        });
    } catch (error) {
        console.error('Error creating resource:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while creating resource',
            error: error.message
        });
    }
};

"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;

/**
 * WebsiteConfig Schema
 * Lưu trữ thông tin, cấu hình chung về website
 */
const websiteConfigSchema = new Schema(
    {
        website_name: { type: String, required: true, default: "My Awesome Website", trim: true, },
        website_logoUrl: { type: String, default: "", },
        website_faviconUrl: { type: String, default: "", },
        website_description: { type: String, default: "", },
        website_contactEmail: { type: String, default: "", lowercase: true, trim: true, },
        website_phone: { type: String, default: "", trim: true, },
        website_address: { type: String, default: "", },
        website_workingHours: { type: String, default: "Mon-Fri: 8:00 - 18:00", },
        website_facebookUrl: { type: String, default: "", },
        website_instagramUrl: { type: String, default: "", },
        website_twitterUrl: { type: String, default: "", },
        website_youtubeUrl: { type: String, default: "", },
        website_mapLatitude: { type: Number, default: 0, },
        website_mapLongitude: { type: Number, default: 0, },
        website_mapEmbed: { type: String, default: "", },
        website_footerText: { type: String, default: "", },
        website_isActive: { type: Boolean, default: true, },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("WebsiteConfig", websiteConfigSchema);

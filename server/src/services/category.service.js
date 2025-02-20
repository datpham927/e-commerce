"use strict";

const { BadRequestRequestError } = require("../core/error.response");
const Category = require("../models/category.model");

class CategoryService {
    static async createCategory(payload) {
        if (Object.keys(payload).length < 2) {
            throw new BadRequestRequestError("Vui lòng cung cấp dữ liệu");
        }
        return await Category.create(payload);
    }
}

module.exports = CategoryService;

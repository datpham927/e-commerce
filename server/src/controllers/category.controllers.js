const CategoryServices = require("../services/category.service")
const { SuccessResponse } = require("../core/success.response")

class CategoryControllers {
    createCategory = async (req, res, next) => {
        new SuccessResponse({
            message: "Tạo danh mục thành công",
            statusCode: 200,
            metadata: await CategoryServices.createCategory({ ...req.body })
        }).send(res)
    }

}

module.exports = new CategoryControllers()
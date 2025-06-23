const Category = require("../models/category");


class CategoryService { 
 async getAllCategories() {
  return await Category.find({ isActive: true });
 }

 async getById(id) { 
  return await Category.findById(id); 
 }

 async create(data) { 
  return await Category.create(data);
 }

 async update(id, data) { 
  return await Category.findByIdAndUpdate(id, data, { new: true });
 }

 async delete(id) {
  return await Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
 }
}

module.exports = new CategoryService();
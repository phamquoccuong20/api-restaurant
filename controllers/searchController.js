const searchService = require("../services/searchService");

const searchByController = async (req, res) => {
  try {
    const { user, category, menu, table } = req.query;
    if(!user && !category && !menu && !table) {
      return res.status(400).json({ message: 'Missing search keyword' });
    }

    const result = await searchService.searchAll(req.query);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
}

module.exports = { searchByController };
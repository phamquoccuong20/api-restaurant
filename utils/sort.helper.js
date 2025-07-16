const getSortOption = (sortType, sortField) => {
  if (!sortType) return {};

  switch (sortType) {
    case 'asc':
      return sortField ? { [sortField]: 1 } : {};

    case 'desc':
      return sortField ? { [sortField]: -1 } : {};

    case 'newest':
      return { createdAt: -1 };

    case 'oldest':
      return { createdAt: 1 };

    default:
      return {};
  }
};

module.exports = { getSortOption };
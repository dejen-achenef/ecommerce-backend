export const sendResponse = (res, { success, message, object, errors = null }) => {
  res.json({ success, message, object, errors });
};

export const sendPaginatedResponse = (
  res,
  { success, message, object, pageNumber, pageSize, totalSize, errors = null }
) => {
  res.json({ success, message, object, pageNumber, pageSize, totalSize, errors });
};

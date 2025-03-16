class BaseController {
  // Send a unified success response
  sendResponse(res, data) {
    res.json(data);
  }

  // Send a unified error response
  sendError(res, error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = BaseController;

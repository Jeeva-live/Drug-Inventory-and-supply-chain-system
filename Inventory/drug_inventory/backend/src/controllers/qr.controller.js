exports.generateQR = async (req, res) => {
  try {
    const payload = req.body;

    res.json({
      success: true,
      message: "QR generated successfully",
      data: payload
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scanQR = async (req, res) => {
  try {
    const { code } = req.body;

    res.json({
      success: true,
      message: "QR scanned successfully",
      code
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const Inventory = require("../models/Inventory.model");
const Drug = require("../models/Drug.model");

// CREATE
exports.createInventory = async (req, res) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getInventory = async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ONE
exports.getInventoryById = async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateInventory = async (req, res) => {
  try {
    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteInventory = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Inventory item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FEFO RULE IMPLEMENTATION
// Returns the batch that expires soonest for a given product
exports.getFefoBatch = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Find all inventory lots for this product with positive stock
    // Populate the 'drug' field to get access to expiry_date
    const batches = await Inventory.find({ productId: productId, current_stock: { $gt: 0 } })
      .populate('drug');

    if (!batches || batches.length === 0) {
      return res.status(404).json({ message: "No stock available for this product" });
    }

    // 2. Sort by Expiry Date (Ascending) -> Earliest first
    // Note: filtered to ensure we don't pick expired drugs if needed, 
    // but FEFO usually implies picking the 'next to expire' that is still valid.
    const validBatches = batches.filter(b => b.drug && new Date(b.drug.expiry_date) > new Date());

    if (validBatches.length === 0) {
      return res.status(400).json({ message: "All batches are expired!" });
    }

    validBatches.sort((a, b) => new Date(a.drug.expiry_date) - new Date(b.drug.expiry_date));

    // 3. Return the best batch
    const bestBatch = validBatches[0];

    res.json({
      message: "FEFO recommendation found",
      recommended_batch: {
        inventory_id: bestBatch._id,
        batch_no: bestBatch.drug.batch_no,
        expiry_date: bestBatch.drug.expiry_date,
        stock_available: bestBatch.current_stock,
        location: bestBatch.location
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==========================================
// BATCH MANAGEMENT (Manufacturer Dashboard)
// ==========================================

// POST /api/inventory/batch
exports.createBatch = async (req, res) => {
  try {
    const { batchId, drugName, mfgDate, expiryDate, quantity } = req.body;

    const newDrug = await Drug.create({
      name: drugName,
      batch_no: batchId,
      mfg_date: mfgDate,
      expiry_date: expiryDate,
      qr_code: `QR-${batchId}`
    });

    const newInventory = await Inventory.create({
      drug: newDrug._id,
      location: 'Manufacturer',
      current_stock: quantity,
      status: 'Active',
      qrStatus: 'Generated'
    });

    await newInventory.populate('drug');
    res.status(201).json(newInventory);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Batch ID already exists" });
    }
    res.status(500).json({ message: err.message });
  }
};

// GET /api/inventory/batch
exports.getBatches = async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = { location: 'Manufacturer' };
    if (status) query.status = new RegExp(`^${status}$`, 'i');

    let batches = await Inventory.find(query)
      .populate('drug')
      .sort({ last_updated: -1 });

    if (search) {
      const s = search.toLowerCase();
      batches = batches.filter(b =>
        (b.drug && b.drug.name.toLowerCase().includes(s)) ||
        (b.drug && b.drug.batch_no.toLowerCase().includes(s))
      );
    }

    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/inventory/batch/:id
exports.updateBatchStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: "Batch not found" });

    inventory.status = status;
    await inventory.save();

    res.json(inventory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

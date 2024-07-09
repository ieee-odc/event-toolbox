const express = require("express");
const formController = require("../controllers/formController.js");

const router = express.Router();

// router.post("/createform",formController.createForm);
// Create a new form
router.post("/createform", async (req, res) => {
  const { eventId, description, name, data } = req.body;
  try {
    const newForm = await formController.createForm(
      eventId,
      description,
      name,
      data
    );
    res.status(201).json(newForm);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get("/getform/:formId", formController.getFormById);
router.get("/:eventId", formController.getFormsByEventId);

//get All
/*router.get('/getAllForms', async (req, res) => {
    try {
        const forms = await formController.getAllForms();
        res.json(forms);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});*/
// Update a form by ID
router.put("/update/:formId", formController.updateFormById);
// Delete a form by ID
router.delete("/delete/:formId", formController.deleteFormById);

//router.get("/getform/:id",getFormById);

module.exports = router;

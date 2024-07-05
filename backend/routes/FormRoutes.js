const express = require('express');
const formController = require('../controllers/formController.js')

const router = express.Router();

// router.post("/createform",formController.createForm);
// Create a new form
router.post('/createform', async (req, res) => {
    const { eventId, price, data } = req.body;
    try {
        const newForm = await formController.createForm(eventId, price, data);
        res.status(201).json(newForm);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get('/getform/:formId', formController.getFormById);
router.get('/:eventId', formController.getFormsByEventId);

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
router.put('/update/:formId', formController.updateFormById);

// router.put('update/:formId', async (req, res) => {
//     const { formId } = req.params;
//     const { price, data } = req.body;
//     try {
//         const updatedForm = await formController.updateFormById(formId, price, data);
//         res.json(updatedForm);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// Delete a form by ID
router.delete('/delete/:formId', formController.deleteFormById);


//router.get("/getform/:id",getFormById);

//router.delete("/deleteform/:id",deleteFormById);

//router.put("/updateForm/:id",updateFormById);

//export default router;
module.exports = router;

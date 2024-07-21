const Link = require('../models/LinkModel');
const Form = require('../models/FormModel');
const { v4: uuidv4 } = require('uuid');

exports.createLink = async (req, res) => {
  const { formId, expirationDate } = req.body;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    const link = new Link({
      formId,
      expirationDate,
      link: uuidv4()
    });

    await link.save();

    res.status(201).json({ link: `${process.env.BASE_URL}/forms/${link.link}` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getFormByLink = async (req, res) => {
  const { link } = req.params;

  try {
    const linkRecord = await Link.findOne({ link });

    if (!linkRecord) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (new Date() > new Date(linkRecord.expirationDate)) {
      return res.status(400).json({ message: 'Link expired' });
    }

    const form = await Form.findById(linkRecord.formId);

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

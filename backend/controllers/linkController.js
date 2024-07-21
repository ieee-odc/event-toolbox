const Link = require('../models/LinkModel');
const Form = require('../models/FormModel');
const { v4: uuidv4 } = require('uuid');

exports.createLink = async (req, res) => {
  const { formId } = req.body;

  try {
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    let link = await Link.findOne({ formId });

    if (link) {
      res.status(200).json({ link: `${process.env.BASE_URL}/forms/${link.link}` });
    } else {
      link = new Link({
        formId,
        link: uuidv4()
      });
      await link.save();
      res.status(201).json({ link: `${process.env.BASE_URL}/forms/${link.link}` });
    }
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

    const form = await Form.findById(linkRecord.formId);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (new Date() > new Date(form.deadline)) {
      return res.status(400).json({ message: 'Link expired' });
    }

    res.status(200).json(form);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getLinkByFormId = async (req, res) => {
  const { formId } = req.params;

  try {
    const link = await Link.findOne({ formId });

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.status(200).json({ link: link.link });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.getAllLinks = async (req, res) => {
  try {
    const links = await Link.find({});
    res.status(200).json(links);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
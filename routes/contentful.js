const contentful = require('contentful');
const express = require('express');
const router = express.Router();

// validate
['CONTENTFUL_SPACE', 'CONTENTFUL_ACCESS'].forEach(reqVar => {
  if (!(process.env[reqVar])) {
    console.error(`Error, ${reqVar} not found!`);
  }
});

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE,
  accessToken: process.env.CONTENTFUL_ACCESS,
});

router.get('/', async (req, res) => {
  const data = await client.getEntries();
  res.json(data.items);
});

router.get('/:type', async (req, res) => {
  const { type } = req.params;
  const data = await client.getEntries({ 'content_type': type });
  res.json(data.items);
});

module.exports = router;

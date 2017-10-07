const express = require('express');
const contentful = require('contentful');
const marked = require('marked');
const render = express.Router();

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


render.get('/', async (req, res) => {
  const data = await client.getEntries({ 'content_type': 'homePage' });
  // there should only exist one homepage item
  const pageInfo = data.items[0].fields;
  const { title, sections } = pageInfo;

  // pull the fields out of the sections
  const sectionFields = sections
    .map(sec => sec.fields)
    .map(fields => {
      const { title, content, images } = fields;
      const parsed = marked(content);
      return { title, parsed, images }
    });

  res.render(`pages/index.handlebars`, {
    title,
    sections: sectionFields,
  });
});

render.get('/about', async (req, res) => {
  const data = await client.getEntries({ 'content_type': 'aboutPage' });
  const pageInfo = data.items[0].fields;
  const { title, optionalDescription, committeeMembers } = pageInfo;
  const description = marked(optionalDescription);
  const memberFields = committeeMembers
    .map(member => member.fields)
    .map(fields => {
      const { name, image, description } = fields;
      const parsed = marked(description);
      return { name, image, parsed };
    });
  res.render(`pages/about.handlebars`, {
    title,
    description,
    members: memberFields,
  });
});

render.get('/events', (req, res) => {
  res.render(`pages/index.handlebars`, {
    selectedPage: 'events',
  });
});

module.exports = render;
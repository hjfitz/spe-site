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

const getFields = async pageType => {
  const data = await client.getEntries({ 'content_type': pageType });
  const pageInfo = data.items[0].fields;
  return pageInfo;
};


render.get('/', async (req, res) => {
  const pageInfo = await getFields('homePage');
  const { title, sections } = pageInfo;

  // pull the fields out of the sections
  const sectionFields = sections
    .filter(entry => 'fields' in entry)
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
  const pageInfo = await getFields('aboutPage');
  const { title, optionalDescription, committeeMembers } = pageInfo;
  const description = marked(optionalDescription);
  const memberFields = committeeMembers
    .filter(entry => 'fields' in entry)
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
    about: 'active'
  });
});

render.get('/events', async (req, res) => {
  const data = await getFields('eventsPage');
  const { title, events } = data;
  const parsedEvents = events
    .filter(entry => 'fields' in entry)
    .map(ev => ev.fields)
    .map(fields => {
      const { title, images, description } = fields;
      const parsedDesc = marked(description);
      return { title, images, parsedDesc };
    });
  res.render(`pages/events.handlebars`, {
    events: 'active',
    title,
    parsedEvents,
  });
});

module.exports = render;
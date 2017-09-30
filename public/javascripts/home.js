const content = document.getElementById('content');
const pageTitle = document.getElementById('title');

const endPoint = '/contentful/homePage';

// hit an endpoint and get the page information
const getInformation = async () => {
  const raw = await fetch(endPoint);
  // parse
  const data = await raw.json();
  return data;
};

// generate sections based on a section type
const generateSection = sectionInfo => {
  // generate containers
  const contentContainer = document.createElement('div');
  const container = document.createElement('section');
  const header = document.createElement('h2');

  // append to main container
  container.appendChild(header);
  container.appendChild(contentContainer);

  // populate containers
  header.textContent = sectionInfo.title;
  // parse markdown and populate
  const parsedContent = marked(sectionInfo.content);
  contentContainer.innerHTML = parsedContent;

  // handle images
  if ('images' in sectionInfo) {
    const { images } = sectionInfo;
    // generate an img for each image
    images.forEach(image => {
      const { fields } = image;
      const img = document.createElement('img');
      img.src = `https:${fields.file.url}`;
      img.alt = fields.title;
      contentContainer.appendChild(img);
    })
  }
  // append to page
  content.appendChild(container);
};

// when we know that we can operate on the page, do stuff
window.onload = async () => {
  const unparsed = await getInformation();
  // get the fields out
  const data = unparsed[0].fields;
  const { title, sections } = data;
  const sectionInfo = sections.map(section => section.fields);
  // set page info
  pageTitle.textContent = title;
  sectionInfo.map(generateSection);
};

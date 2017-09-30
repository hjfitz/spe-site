const content = document.getElementById('content');
const pageTitle = document.getElementById('title');

const endPoint = '/contentful/eventsPage';


// hit an endpoint and get the page information
const getInformation = async () => {
  const raw = await fetch(endPoint);
  // parse
  const data = await raw.json();
  return data;
};

const generateEvents = ev => {
  const imageContainer = document.createElement('div');
  const container = document.createElement('section');
  const descContainer = document.createElement('div');
  const header = document.createElement('h2');
  const { title, description, images } = ev.fields;
  const parsedDesc = marked(description);
  descContainer.innerHTML = parsedDesc;
  header.textContent = title;
  images.forEach(image => {
    const img = document.createElement('img');
    const { file, title } = image.fields;
    img.alt = title;
    img.src = `https:${file.url}`;
    imageContainer.appendChild(img);
  });
  container.appendChild(header);
  container.appendChild(descContainer);
  container.appendChild(imageContainer);
  content.appendChild(container);
};

window.onload = async () => {
  const unparsed = await getInformation();
  const data = unparsed[0].fields;
  const { title, events } = data;
  pageTitle.textContent = title;
  events.map(generateEvents);
};

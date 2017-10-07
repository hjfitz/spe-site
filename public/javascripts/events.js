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
  // validation for drafts
  if (!('fields' in ev && 'title' in ev.fields && 'description' in ev.fields)) return;
  const container = document.createElement('section');

  // image slider
  const imageContainer = document.createElement('div');
  const imageList = document.createElement('ul');
  imageContainer.classList = 'slider';
  imageContainer.appendChild(imageList);
  imageList.classList = 'slides';
  
  // destructure to get the title and desc
  const { title, description } = ev.fields;  
  const images = [];
  // check if there exist images - they're *optional* on contentful
  if ('images' in ev.fields) images.push(...ev.fields.images);

  // set the container innards
  container.innerHTML = 
    `<h2>${title}</h2>
    <div>${marked(description)}</div>`;

  // generate the image slider
  images.forEach(image => {
    const img = document.createElement('li');
    const { file, title } = image.fields;    
    img.innerHTML = `<img src=${file.url} alt=${title} />`
    imageList.appendChild(img);
  });
  container.appendChild(imageContainer);
  content.appendChild(container);
};

window.onload = async () => {
  const unparsed = await getInformation();
  const data = unparsed[0].fields;
  const { title, events } = data;
  pageTitle.textContent = title;
  events.map(generateEvents);
  $('.slider').slider();  
};

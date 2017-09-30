const content = document.getElementById('content');
const pageTitle = document.getElementById('title');

const endPoint = '/contentful/aboutPage';

// hit an endpoint and get the page information
const getInformation = async () => {
  const raw = await fetch(endPoint);
  // parse
  const data = await raw.json();
  return data;
};

const generatePage = committeeMembers => {
  const memberFields = committeeMembers.map(member => member.fields);
  const membersContainer = document.createElement('section');
  memberFields.forEach(field => {
    const container = document.createElement('div');
    const { name, description, image } = field;
    const nameContainer = document.createElement('h3');
    const descContainer = document.createElement('div');
    const img = document.createElement('img');
    const parsedDesc = marked(description);
    const { file, title } = image.fields;
    nameContainer.textContent = name;
    descContainer.innerHTML = parsedDesc;
    img.alt = title;
    img.src = `http:${file.url}`;
    container.appendChild(nameContainer);
    container.appendChild(descContainer);
    container.appendChild(img);
    membersContainer.appendChild(container);
  });
  return membersContainer;
};

window.onload = async () => {
  const unparsed = await getInformation();
  // get the fields out
  const data = unparsed[0].fields;
  const { title, committeeMembers, optionalDescription } = data;

  pageTitle.textContent = title;
  const infoContainer = document.createElement('section');
  const parsedInfo = marked(optionalDescription);
  const parsedMembers = generatePage(committeeMembers);
  // set the innerHTML as marked return a string and not a domlist
  content.innerHTML = parsedInfo;
  content.appendChild(parsedMembers);



};

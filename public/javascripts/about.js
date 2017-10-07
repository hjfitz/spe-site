const content = document.getElementById('content');
const pageTitle = document.getElementById('title');

const endPoint = '/contentful/aboutPage';

// hit an endpoint and get the page information
const getInformation = async () => {
  const raw = await fetch(endPoint);
  const data = await raw.json();
  return data;
};


/**
 * Create DOM elements to store committee members
 * Extract the fields from the response 
 * Create a div, and create the innerHTML accordingly
 * Append that to the main member container
 * @param {Array} committeeMembers list of committee member information
 * @return {DOMElement} A <section> containing our members
 */
const generatePage = committeeMembers => {
  const membersContainer = document.createElement('section');
  committeeMembers
    .map(member => member.fields)
    .map(fields => {
      const { name, description, image } = fields;   
      const { file, title } = image.fields;   
      const container = document.createElement('div');
      container.innerHTML = 
        `<h4>${name}</h4>
        <div>${marked(description)}</div>
        <img alt="${title}" src="https:${file.url}" />`;
      return container;
    })
    .map(container => membersContainer.appendChild(container));
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

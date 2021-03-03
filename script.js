const filtersContainer = document.querySelector('.filters');

function handleInputChange(element) {
  element.nextElementSibling.textContent = element.value;
  document.documentElement.style.setProperty(
    `--${element.name}`,
    `${element.value}${element.dataset.sizing}`
  );
}

filtersContainer.addEventListener('input', (e) => {
  if (e.target.tagName != 'INPUT' || e.target.type != 'range') return;
  handleInputChange(e.target);
});

// Reset button
const resetButton = document.querySelector('.btn-reset');

function resetInputValues() {
  filtersContainer.querySelectorAll('input').forEach((input) => {
    if (input.name == 'saturate') input.value = 100;
    else input.value = 0;
    handleInputChange(input);
  });
}

resetButton.addEventListener('click', resetInputValues);

// Next picture button
const image = document.querySelector('img');

const nextPicButton = document.querySelector('.btn-next');

function getCurrentFolder() {
  const currentTime = new Date().getHours() + 1;
  switch (true) {
    case currentTime < 6:
      return 'night';
    case currentTime < 12:
      return 'morning';
    case currentTime < 18:
      return 'day';
    case currentTime < 24:
      return 'evening';
  }
}

async function getImageNames(time) {
  return await fetch(
    `https://api.github.com/repos/rolling-scopes-school/stage1-tasks/contents/images/${time}?ref=assets`
  )
    .then((response) => response.json())
    .then((items) => items.filter((item) => item.type === 'file'));
}

let i = 0;
let files = [];

async function changePicture() {
  const currentTime = getCurrentFolder();

  files = await getImageNames(currentTime);
  i = i % files.length;

  const img = new Image();
  img.src = files[i].download_url;
  img.onload = () => {
    image.src = img.src;
  };
  i++;
}

nextPicButton.addEventListener('click', changePicture);

// Load picture button
const loadPicButton = document.querySelector('.btn-load--input');

function loadPicture(e) {
  console.log(loadPicButton.files[0]);
  let reader = new FileReader();

  reader.onloadend = function () {
    image.src = reader.result;
  };

  if (loadPicButton.files[0]) {
    reader.readAsDataURL(loadPicButton.files[0]);
  }
}

loadPicButton.addEventListener('change', loadPicture);

// Download picture button
const downloadPicButton = document.querySelector('.btn-save');

function drawImage() {
  return new Promise((resolve, reject) => {
    let canvas = document.createElement('canvas');
    const img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = image.src;
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      let filters = '';
      filtersContainer.querySelectorAll('input').forEach((input) => {
        filters += `${input.name}(${input.value}${input.dataset.sizing}) `;
      });
      ctx.filter = filters.trim();
      ctx.drawImage(img, 0, 0);

      resolve(canvas);
    };
  });
}

function downloadPicture() {
  drawImage().then((canvas) => {
    const dataURL = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.jpg';
    link.click();
  });
}

downloadPicButton.addEventListener('click', downloadPicture);

// Fullscreen
const fullScreenButon = document.querySelector('.fullscreen');

function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else if (document.exitFullscreen) document.exitFullscreen();
}

fullScreenButon.addEventListener('click', toggleFullScreen);

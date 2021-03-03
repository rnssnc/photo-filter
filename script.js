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
  this.classList.add('btn-active');
  filtersContainer.querySelectorAll('input').forEach((input) => {
    console.log(input.name);
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

// Fullscreen
const fullScreenButon = document.querySelector('.fullscreen');

function toggleFullScreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else if (document.exitFullscreen) document.exitFullscreen();
}

fullScreenButon.addEventListener('click', toggleFullScreen);

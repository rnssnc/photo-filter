const filtersContainer = document.querySelector('.filters');

function handleFilterContainerChange(e) {
  if (e.target.tagName != 'INPUT' || e.target.type != 'range') return;
  e.target.nextElementSibling.textContent = e.target.value;
  document.documentElement.style.setProperty(
    `--${e.target.name}`,
    `${e.target.value}${e.target.dataset.sizing}`
  );
}

filtersContainer.addEventListener('input', handleFilterContainerChange);

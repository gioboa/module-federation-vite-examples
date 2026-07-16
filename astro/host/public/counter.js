for (const button of document.querySelectorAll("[data-counter]")) {
  let count = 0;

  button.addEventListener("click", () => {
    count += 1;
    button.textContent = `${button.dataset.counter} counter: ${count}`;
  });
}

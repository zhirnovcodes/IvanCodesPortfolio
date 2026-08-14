(function () {
  var mount = document.getElementById("titles");
  if (!mount) return;

  var IMAGE_BASE = "assets/images/hello/titles/";
  var hoveredItem = null;
  var clickedItem = null;
  var list = null;

  function showError(message) {
    mount.textContent = message;
  }

  function updateHighlight() {
    if (!list) return;

    list.querySelectorAll(".title-item.is-selected").forEach(function (item) {
      item.classList.remove("is-selected");
    });

    var activeItem = hoveredItem || clickedItem;
    if (activeItem) {
      activeItem.classList.add("is-selected");
    }
  }

  function createTitleItem(title) {
    var link = document.createElement("a");
    link.className = "title-item";
    link.href = title.link;
    link.setAttribute("aria-label", title.name);

    var img = document.createElement("img");
    img.src = IMAGE_BASE + title.image;
    img.alt = title.name;
    img.width = 150;
    img.height = 100;
    link.appendChild(img);

    link.addEventListener("mouseenter", function () {
      hoveredItem = link;
      clickedItem = null;
      updateHighlight();
    });

    link.addEventListener("mouseleave", function () {
      hoveredItem = null;
      updateHighlight();
    });

    link.addEventListener("click", function () {
      clickedItem = link;
      updateHighlight();
    });

    link.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        clickedItem = link;
        updateHighlight();
      }
    });

    return link;
  }

  function bindTitleInteractions() {
    if (!list) return;

    list.addEventListener("mouseleave", function () {
      hoveredItem = null;
      clickedItem = null;
      updateHighlight();
    });
  }

  function renderTitles(data) {
    mount.replaceChildren();
    hoveredItem = null;
    clickedItem = null;

    var heading = document.createElement("h1");
    heading.className = "titles-heading";
    heading.textContent = "Titles";
    mount.appendChild(heading);

    list = document.createElement("div");
    list.className = "titles-list";
    list.setAttribute("role", "list");

    data.titles.forEach(function (title) {
      list.appendChild(createTitleItem(title));
    });

    mount.appendChild(list);
    bindTitleInteractions();
  }

  fetch("data/titles.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load titles data.");
      }
      return response.json();
    })
    .then(renderTitles)
    .catch(function () {
      showError("Titles could not be loaded.");
    });
})();

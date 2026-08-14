(function () {
  var mount = document.getElementById("skills");
  if (!mount) return;

  var clickedItem = null;
  var hoveredItem = null;
  var popup = null;

  function showError(message) {
    mount.textContent = message;
  }

  function updatePopup() {
    if (!popup) return;

    var activeItem = hoveredItem || clickedItem;
    var description = activeItem ? activeItem.dataset.description : "";

    if (!activeItem || !description) {
      popup.hidden = true;
      popup.textContent = "";
      return;
    }

    popup.textContent = description;
    popup.hidden = false;

    var anchor = activeItem.querySelector(".skill-name") || activeItem;
    var anchorRect = anchor.getBoundingClientRect();
    var mountRect = mount.getBoundingClientRect();

    popup.style.left = anchorRect.left - mountRect.left + "px";
    popup.style.top = anchorRect.bottom - mountRect.top + 8 + "px";
    popup.style.maxWidth = Math.max(200, mountRect.width - (anchorRect.left - mountRect.left)) + "px";
  }

  function updateHighlight() {
    mount.querySelectorAll(".skill-item.is-highlighted").forEach(function (item) {
      item.classList.remove("is-highlighted");
    });

    var activeItem = hoveredItem || clickedItem;
    if (activeItem) {
      activeItem.classList.add("is-highlighted");
    }

    updatePopup();
  }

  function createSkillItem(skill) {
    var item = document.createElement("li");
    item.className = "skill-item";
    item.dataset.score = String(skill.score);
    item.dataset.description = skill.description || "";

    var stars = document.createElement("span");
    stars.className = "skill-stars";
    stars.setAttribute("aria-hidden", "true");

    for (var i = 0; i < skill.score; i += 1) {
      var star = document.createElement("img");
      star.src = "assets/icons/star.png";
      star.alt = "";
      star.width = 18;
      star.height = 18;
      stars.appendChild(star);
    }

    item.appendChild(stars);

    var name = document.createElement("span");
    name.className = "skill-name";
    name.textContent = skill.name;
    item.appendChild(name);
    item.tabIndex = 0;
    return item;
  }

  function bindSkillInteractions() {
    mount.querySelectorAll(".skill-item").forEach(function (item) {
      item.addEventListener("mouseenter", function () {
        hoveredItem = item;
        clickedItem = null;
        updateHighlight();
      });

      item.addEventListener("mouseleave", function () {
        hoveredItem = null;
        updateHighlight();
      });

      item.addEventListener("click", function () {
        if (clickedItem === item) {
          clickedItem = null;
        } else {
          clickedItem = item;
        }
        updateHighlight();
      });

      item.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          clickedItem = item;
          updateHighlight();
        }
      });
    });

    mount.addEventListener("mouseleave", function () {
      hoveredItem = null;
      clickedItem = null;
      updateHighlight();
    });

    window.addEventListener("scroll", updatePopup, true);
    window.addEventListener("resize", updatePopup);
  }

  function renderCategory(category) {
    var section = document.createElement("section");
    section.className = "skills-category";

    var heading = document.createElement("h2");
    heading.textContent = category.name;
    section.appendChild(heading);

    var list = document.createElement("ul");
    list.className = "skills-list";

    var skills = category.skills.slice().sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    skills.forEach(function (skill) {
      list.appendChild(createSkillItem(skill));
    });

    section.appendChild(list);
    return section;
  }

  function renderSkills(data) {
    mount.replaceChildren();
    clickedItem = null;
    hoveredItem = null;

    var title = document.createElement("h1");
    title.className = "skills-title";
    title.textContent = "Skills";
    mount.appendChild(title);

    data.categories.forEach(function (category) {
      mount.appendChild(renderCategory(category));
    });

    popup = document.createElement("div");
    popup.className = "skill-popup";
    popup.setAttribute("role", "tooltip");
    popup.hidden = true;
    mount.appendChild(popup);

    bindSkillInteractions();
  }

  fetch("data/skills.json")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Failed to load skills data.");
      }
      return response.json();
    })
    .then(renderSkills)
    .catch(function () {
      showError("Skills could not be loaded.");
    });
})();

/* ==========================================================
   Wanderly Travel Club - IT312 Phase 3
   One shared JavaScript file for the whole website.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ==========================================================
     HOME PAGE (index.html) - Latifah Albahily
     Theme switch, Back to Top, footer clock, Trip of the Month countdown
     ========================================================== */
  if (document.getElementById("theme-toggle")) {


    /* ---------- 1. Theme switch ---------- */
    var themeButton = document.getElementById("theme-toggle");
    var THEME_KEY = "wanderly-theme";

    function applyTheme(theme) {
      if (theme === "dark") {
        document.body.classList.add("dark-theme");
        themeButton.textContent = "Light theme";
        themeButton.setAttribute("aria-pressed", "true");
      } else {
        document.body.classList.remove("dark-theme");
        themeButton.textContent = "Dark theme";
        themeButton.setAttribute("aria-pressed", "false");
      }
    }

    // remember the last theme the visitor chose (if the browser allows it)
    var savedTheme = "light";
    try {
      savedTheme = localStorage.getItem(THEME_KEY) || "light";
    } catch (e) { /* storage not available: keep light theme */ }
    applyTheme(savedTheme);

    themeButton.addEventListener("click", function () {
      var newTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
      applyTheme(newTheme);
      try {
        localStorage.setItem(THEME_KEY, newTheme);
      } catch (e) { /* ignore */ }
    });

    /* ---------- 2. Back to Top button ---------- */
    var backToTop = document.getElementById("back-to-top");

    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        backToTop.classList.add("show");
      } else {
        backToTop.classList.remove("show");
      }
    });

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    /* ---------- 3. Real-time clock ---------- */
    var clock = document.getElementById("live-clock");

    function updateClock() {
      var now = new Date();
      var date = now.toLocaleDateString("en-GB", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
      var time = now.toLocaleTimeString("en-US", {
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
      clock.textContent = date + " | " + time;
    }

    updateClock();
    setInterval(updateClock, 1000);

    /* ---------- 4. Trip of the Month countdown ---------- */
    var countdown = document.getElementById("trip-countdown");
    var departure = new Date(countdown.getAttribute("data-departure"));
    var parts = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds")
    };

    function twoDigits(n) {
      return n < 10 ? "0" + n : String(n);
    }

    function updateCountdown() {
      var diff = departure - new Date();
      if (diff <= 0) {
        countdown.textContent = "The trip has started. See you on the next one!";
        clearInterval(countdownTimer);
        return;
      }
      var totalSeconds = Math.floor(diff / 1000);
      parts.days.textContent = Math.floor(totalSeconds / 86400);
      parts.hours.textContent = twoDigits(Math.floor((totalSeconds % 86400) / 3600));
      parts.minutes.textContent = twoDigits(Math.floor((totalSeconds % 3600) / 60));
      parts.seconds.textContent = twoDigits(totalSeconds % 60);
    }

    var countdownTimer = setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  /* ==========================================================
     CLUB OFFERINGS PAGE (offerings.html) - Latifah Albahily
     Random order on load + sorting by name or price
     ========================================================== */
  if (document.getElementById("offerings-list")) {

    var list = document.getElementById("offerings-list");
    var sortSelect = document.getElementById("sort");

    // the sort control is inside a form: never reload the page
    sortSelect.form.addEventListener("submit", function (event) { event.preventDefault(); });

    // array of the offering cards
    var cards = Array.prototype.slice.call(list.querySelectorAll(".offering-card"));

    function showCards(orderedCards) {
      orderedCards.forEach(function (card) {
        list.appendChild(card); // appendChild moves the card to the end, in order
      });
    }

    // 1. random order (Fisher-Yates shuffle)
    function shuffle(array) {
      var copy = array.slice();
      for (var i = copy.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = copy[i];
        copy[i] = copy[j];
        copy[j] = temp;
      }
      return copy;
    }

    showCards(shuffle(cards));

    // 2. sorting
    sortSelect.addEventListener("change", function () {
      var option = sortSelect.value;
      var sorted = cards.slice();

      if (option === "price-asc") {
        sorted.sort(function (a, b) { return Number(a.dataset.price) - Number(b.dataset.price); });
      } else if (option === "price-desc") {
        sorted.sort(function (a, b) { return Number(b.dataset.price) - Number(a.dataset.price); });
      } else if (option === "name-asc") {
        sorted.sort(function (a, b) { return a.dataset.name.localeCompare(b.dataset.name); });
      } else if (option === "name-desc") {
        sorted.sort(function (a, b) { return b.dataset.name.localeCompare(a.dataset.name); });
      } else {
        sorted = shuffle(cards); // "-- Choose --" goes back to a random order
      }

      showCards(sorted);
    });
  }

  /* ==========================================================
     ABOUT US PAGE (about.html) - Latifah Albahily
     "Join Our Team" form validation
     ========================================================== */
  if (document.getElementById("join-form")) {

    var form = document.getElementById("join-form");
    var nameInput = document.getElementById("join-name");
    var photoInput = document.getElementById("join-photo");
    var dobInput = document.getElementById("join-dob");

    // clear an old error message as soon as the user changes the field
    [nameInput, photoInput, dobInput].forEach(function (input) {
      input.addEventListener("input", function () { input.setCustomValidity(""); });
      input.addEventListener("change", function () { input.setCustomValidity(""); });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // there is no server, so we never really send the form

      // 1. no empty fields (a field with only spaces counts as empty)
      var textFields = form.querySelectorAll("input[type='text'], input[type='email']");
      textFields.forEach(function (field) {
        field.setCustomValidity(field.value.trim() === "" ? "Please fill out this field." : "");
      });

      // 2. the name cannot start with a number
      var name = nameInput.value.trim();
      if (name !== "" && /^[0-9]/.test(name)) {
        nameInput.setCustomValidity("The name cannot start with a number.");
      }

      // 3. the photo must be an image file
      var file = photoInput.files[0];
      if (file && file.type.indexOf("image/") !== 0) {
        photoInput.setCustomValidity("Please choose an image file (for example .jpg or .png).");
      } else {
        photoInput.setCustomValidity("");
      }

      // 4. the year of birth must be 2008 or earlier
      if (dobInput.value) {
        var year = new Date(dobInput.value).getFullYear();
        dobInput.setCustomValidity(year > 2008 ? "The year of birth must be 2008 or earlier." : "");
      }

      // show the browser's error bubble on the first wrong field
      if (!form.reportValidity()) {
        return;
      }

      alert("Thank you, " + name + "! Your request to join the Wanderly team has been received.");
      form.reset();
    });
  }

});


/* ==========================================================
   ADDITIONAL PAGES - Club Manager Dashboard, Add Offering,
   and Manage Activity Leaders / Instructors.
   This block is added after Latifah's original Phase 3 code.
   ========================================================== */
document.addEventListener("DOMContentLoaded", function () {
  var THEME_KEY_SHARED = "wanderly-theme";

  /* Apply Latifah's saved theme on every page, not only Home.
     The Home page's existing button remains the only theme switch. */
  try {
    var savedThemeForPage = localStorage.getItem(THEME_KEY_SHARED) || "light";
    document.body.classList.toggle("dark-theme", savedThemeForPage === "dark");
  } catch (error) {
    document.body.classList.remove("dark-theme");
  }

  var OFFERINGS_KEY = "wanderly-manager-offerings";
  var LEADERS_KEY = "wanderly-team-members";

  function readStoredArray(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (error) {
      return [];
    }
  }

  function saveStoredArray(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function escapeText(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function fileAsDataURL(file) {
    return new Promise(function (resolve, reject) {
      if (!file) {
        resolve("");
        return;
      }
      var reader = new FileReader();
      reader.onload = function () { resolve(reader.result); };
      reader.onerror = function () { reject(new Error("The selected image could not be read.")); };
      reader.readAsDataURL(file);
    });
  }

  /* 1. CLUB MANAGER DASHBOARD
     Show all offerings previously saved from Add a New Offering. */
  var managerTableBody = document.getElementById("manager-offerings-list");
  if (managerTableBody) {
    var savedOfferings = readStoredArray(OFFERINGS_KEY);
    var emptyMessage = document.getElementById("manager-empty-message");
    managerTableBody.innerHTML = "";

    if (savedOfferings.length === 0) {
      if (emptyMessage) emptyMessage.hidden = false;
    } else {
      if (emptyMessage) emptyMessage.hidden = true;
      savedOfferings.forEach(function (offering) {
        var row = document.createElement("tr");

        var nameCell = document.createElement("td");
        nameCell.textContent = offering.name;

        var categoryCell = document.createElement("td");
        categoryCell.textContent = offering.category || "General";

        var priceCell = document.createElement("td");
        priceCell.textContent = Number(offering.price).toFixed(2) + " SAR";

        var availabilityCell = document.createElement("td");
        var status = document.createElement("span");
        status.className = "status status-completed";
        status.textContent = "Available";
        availabilityCell.appendChild(status);

        row.appendChild(nameCell);
        row.appendChild(categoryCell);
        row.appendChild(priceCell);
        row.appendChild(availabilityCell);
        managerTableBody.appendChild(row);
      });
    }
  }

  /* 2. ADD A NEW OFFERING
     Validate the form, append to an array in localStorage,
     show a success message, and clear the form. */
  var offeringNameInput = document.getElementById("offering-name");
  var offeringForm = offeringNameInput ? offeringNameInput.closest("form") : null;

  if (offeringForm) {
    offeringForm.noValidate = true;
    offeringForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      var nameInput = document.getElementById("offering-name");
      var imageInput = document.getElementById("offering-image");
      var priceInput = document.getElementById("offering-price");
      var descriptionInput = document.getElementById("offering-description");

      var requiredFields = [nameInput, imageInput, priceInput, descriptionInput];
      var emptyField = requiredFields.find(function (field) {
        return field.type === "file" ? !field.files || field.files.length === 0 : !field.value.trim();
      });

      if (emptyField) {
        var missingLabel = offeringForm.querySelector('label[for="' + emptyField.id + '"]');
        alert("Please complete the " + (missingLabel ? missingLabel.textContent.trim() : "required") + " field.");
        emptyField.focus();
        return;
      }

      if (/^[0-9]/.test(nameInput.value.trim())) {
        alert("Offering Name cannot start with a number.");
        nameInput.focus();
        return;
      }

      if (!imageInput.files[0].type || imageInput.files[0].type.indexOf("image/") !== 0) {
        alert("Offering Image must be an image file.");
        imageInput.focus();
        return;
      }

      if (!Number.isFinite(Number(priceInput.value)) || Number(priceInput.value) < 0) {
        alert("Price must be a valid non-negative number.");
        priceInput.focus();
        return;
      }

      try {
        var imageData = await fileAsDataURL(imageInput.files[0]);
        var offerings = readStoredArray(OFFERINGS_KEY);

        offerings.push({
          id: Date.now(),
          name: nameInput.value.trim(),
          imageName: imageInput.files[0].name,
          imageData: imageData,
          price: Number(priceInput.value),
          description: descriptionInput.value.trim(),
          category: "General"
        });

        saveStoredArray(OFFERINGS_KEY, offerings);
        alert('"' + nameInput.value.trim() + '" has been added successfully.');
        offeringForm.reset();
      } catch (error) {
        alert("The offering could not be saved. Please try a smaller image and try again.");
      }
    });
  }

  /* 3. MANAGE ACTIVITY LEADERS AND INSTRUCTORS
     Use one array of objects for the whole team. */
  var leaderList = document.getElementById("leader-management-list");

  if (leaderList) {
    var storedLeaders = readStoredArray(LEADERS_KEY);
    var leaders;
    var hasSavedLeaderList = false;
    try {
      hasSavedLeaderList = localStorage.getItem(LEADERS_KEY) !== null;
    } catch (error) {
      hasSavedLeaderList = false;
    }

    if (hasSavedLeaderList) {
      leaders = storedLeaders;
    } else {
      // Use the five people already shown in the supplied Phase 2 page.
      leaders = Array.prototype.slice.call(
        leaderList.querySelectorAll(".leader-management-card")
      ).map(function (card) {
        var checkbox = card.querySelector('input[type="checkbox"]');
        var image = card.querySelector("img");
        var name = card.querySelector(".leader-management-info strong");
        var expertise = card.querySelector(".leader-management-info small");

        return {
          id: checkbox ? checkbox.value : "member-" + Date.now() + Math.random(),
          name: name ? name.textContent.trim() : "",
          expertise: expertise ? expertise.textContent.trim() : "",
          imageName: image ? image.getAttribute("src") : "",
          imageData: ""
        };
      });
      saveStoredArray(LEADERS_KEY, leaders);
    }

    function renderLeaderList() {
      leaderList.innerHTML = "";

      leaders.forEach(function (person) {
        var label = document.createElement("label");
        label.className = "leader-management-card";

        var image = document.createElement("img");
        image.src = person.imageData || person.imageName || "images/logo.svg";
        image.alt = person.name;

        var info = document.createElement("span");
        info.className = "leader-management-info";

        var name = document.createElement("strong");
        name.textContent = person.name;

        var expertise = document.createElement("small");
        expertise.textContent = person.expertise || "Activity Leader / Instructor";

        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "delete-leaders";
        checkbox.value = person.id;

        info.appendChild(name);
        info.appendChild(expertise);
        label.appendChild(image);
        label.appendChild(info);
        label.appendChild(checkbox);
        leaderList.appendChild(label);
      });
    }

    renderLeaderList();

    var deleteForm = document.getElementById("delete-leaders-form");
    if (deleteForm) {
      deleteForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var selectedIds = Array.prototype.slice.call(
          leaderList.querySelectorAll('input[type="checkbox"]:checked')
        ).map(function (checkbox) {
          return checkbox.value;
        });

        if (selectedIds.length === 0) {
          alert("Please select at least one activity leader or instructor to delete.");
          return;
        }

        if (confirm("Are you sure you want to delete the selected person(s)?")) {
          leaders = leaders.filter(function (person) {
            return selectedIds.indexOf(String(person.id)) === -1;
          });
          saveStoredArray(LEADERS_KEY, leaders);
          renderLeaderList();
        }
      });
    }

    var addLeaderForm = document.getElementById("add-leader-form");
    if (addLeaderForm) {
      addLeaderForm.noValidate = true;
      addLeaderForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        var nameInput = document.getElementById("leader-name");
        var photoInput = document.getElementById("leader-photo");
        var dobInput = document.getElementById("leader-dob");
        var emailInput = document.getElementById("leader-email");
        var expertiseInput = document.getElementById("leader-expertise");
        var skillsInput = document.getElementById("leader-skills");
        var educationInput = document.getElementById("leader-education");

        var requiredFields = [
          nameInput, photoInput, dobInput, emailInput,
          expertiseInput, skillsInput, educationInput
        ];

        var emptyField = requiredFields.find(function (field) {
          return field.type === "file" ? !field.files || field.files.length === 0 : !field.value.trim();
        });

        if (emptyField) {
          alert("Please complete all fields before adding a team member.");
          emptyField.focus();
          return;
        }

        if (/^[0-9]/.test(nameInput.value.trim())) {
          alert("Name cannot start with a number.");
          nameInput.focus();
          return;
        }

        if (!photoInput.files[0].type || photoInput.files[0].type.indexOf("image/") !== 0) {
          alert("Please select an image file.");
          photoInput.focus();
          return;
        }

        if (!emailInput.checkValidity()) {
          alert("Please enter a valid email address.");
          emailInput.focus();
          return;
        }

        try {
          var photoData = await fileAsDataURL(photoInput.files[0]);

          leaders.push({
            id: "leader-" + Date.now(),
            name: nameInput.value.trim(),
            expertise: expertiseInput.value.trim(),
            skills: skillsInput.value.trim(),
            education: educationInput.value.trim(),
            dateOfBirth: dobInput.value,
            email: emailInput.value.trim(),
            imageName: photoInput.files[0].name,
            imageData: photoData
          });

          saveStoredArray(LEADERS_KEY, leaders);
          renderLeaderList();
          alert(nameInput.value.trim() + " has been added successfully.");
          addLeaderForm.reset();
        } catch (error) {
          alert("The team member could not be added. Please try a smaller image.");
        }
      });
    }
  }

  /* Helpers shared by the Request to Join and Offering Evaluation forms
     (highlight an invalid field, and remove the highlight once fixed). */
  function markInvalid(control) {
    var box = control ? control.closest(".field, .rating") : null;
    if (box) box.classList.add("field-error");
  }

  function clearInvalid(form) {
    var boxes = form.querySelectorAll(".field-error");
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].classList.remove("field-error");
    }
  }

  function removeErrorWhenFixed(form) {
    function fix(event) {
      var box = event.target.closest(".field, .rating");
      if (box) box.classList.remove("field-error");
    }
    form.addEventListener("input", fix);
    form.addEventListener("change", fix);
  }

  function showProblems(title, problems) {
    alert(title + "\n\n- " + problems.join("\n- "));
  }

  /* 4. REQUEST TO JOIN AN OFFERING
     Validate the request and keep new requests on this page only
     (they are NOT stored, so they disappear when the member leaves). */
  var requestSelect = document.getElementById("offering");
  var requestForm = requestSelect ? requestSelect.closest("form") : null;
  if (requestForm) {
    requestForm.noValidate = true;
    removeErrorWhenFixed(requestForm);

    var fullNameInput = document.getElementById("full-name");
    var preferredDateInput = document.getElementById("preferred-date");

    // Only dates after today are allowed (tomorrow is the earliest).
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var tomorrowString = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    if (preferredDateInput) preferredDateInput.min = tomorrowString;

    // Panel that lists the requests added during this visit.
    var requestDisplay = document.createElement("section");
    requestDisplay.className = "dashboard-panel";
    requestDisplay.id = "current-session-requests";
    requestDisplay.hidden = true;
    requestDisplay.innerHTML =
      "<h2>Requests Added During This Visit</h2>" +
      "<div class=\"table-wrap\"><table class=\"data-table\">" +
      "<thead><tr><th scope=\"col\">Offering</th><th scope=\"col\">Member</th><th scope=\"col\">Preferred Date</th></tr></thead>" +
      "<tbody></tbody></table></div>";
    requestForm.insertAdjacentElement("afterend", requestDisplay);
    var requestRows = requestDisplay.querySelector("tbody");

    // 2025-12-31  ->  31/12/2025 (same format as the dashboard)
    function formatDate(isoDate) {
      var parts = isoDate.split("-");
      return parts[2] + "/" + parts[1] + "/" + parts[0];
    }

    requestForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearInvalid(requestForm);

      var problems = [];
      var firstInvalid = null;
      var fullName = fullNameInput.value.trim().replace(/\s+/g, " ");
      var selectedDate = preferredDateInput.value;

      // 1) an offering must be selected
      if (!requestSelect.value) {
        problems.push("No offering is selected. Please choose an offering.");
        markInvalid(requestSelect);
        firstInvalid = firstInvalid || requestSelect;
      }

      // 2) full name: letters only, at least two words (first + last name)
      if (fullName === "") {
        problems.push("The name is empty. Please enter your full name.");
        markInvalid(fullNameInput);
        firstInvalid = firstInvalid || fullNameInput;
      } else if (/[0-9]/.test(fullName) || !/^[\p{L} '\u2019-]+$/u.test(fullName)) {
        problems.push("The name must not contain numbers or characters such as ?, !, or @.");
        markInvalid(fullNameInput);
        firstInvalid = firstInvalid || fullNameInput;
      } else if (fullName.split(" ").length < 2) {
        problems.push("The name is not a full name. Please enter your first and last name.");
        markInvalid(fullNameInput);
        firstInvalid = firstInvalid || fullNameInput;
      }

      // 3) the preferred date must be in the future
      if (selectedDate === "") {
        problems.push("No preferred date is chosen. Please pick a date.");
        markInvalid(preferredDateInput);
        firstInvalid = firstInvalid || preferredDateInput;
      } else if (selectedDate < tomorrowString) {
        problems.push("The preferred date must be a future date.");
        markInvalid(preferredDateInput);
        firstInvalid = firstInvalid || preferredDateInput;
      }

      if (problems.length > 0) {
        showProblems("Your request was not sent. Please fix the following:", problems);
        firstInvalid.focus();
        return;
      }

      // Valid: offer to stay on the page or return to the dashboard.
      var optionText = requestSelect.options[requestSelect.selectedIndex].text;
      var dashIndex = optionText.indexOf(" \u2013 ");          // remove the " - price" part
      var offeringName = dashIndex === -1 ? optionText : optionText.slice(0, dashIndex);

      var stayOnPage = confirm(
        "Your request to join \"" + offeringName + "\" was sent successfully.\n\n" +
        "Press OK to stay on this page and add another request,\n" +
        "or Cancel to return to the Member Dashboard."
      );

      if (stayOnPage) {
        var row = document.createElement("tr");
        [offeringName, fullName, formatDate(selectedDate)].forEach(function (value) {
          var cell = document.createElement("td");
          cell.textContent = value;
          row.appendChild(cell);
        });
        requestRows.appendChild(row);
        requestDisplay.hidden = false;
        requestForm.reset();
        requestSelect.focus();
      } else {
        window.location.href = "member-dashboard.html";
      }
    });
  }

  /* 5. OFFERING EVALUATION
     The member must choose an offering, give a rating and write feedback.
     Then a thank-you (good rating) or apology message is shown and the
     member is sent back to the Club Member Dashboard. Nothing is stored. */
  var completedOfferingSelect = document.getElementById("completed-offering");
  var evaluationForm = completedOfferingSelect ? completedOfferingSelect.closest("form") : null;
  if (evaluationForm) {
    evaluationForm.noValidate = true;
    removeErrorWhenFixed(evaluationForm);

    var ratingGroup = evaluationForm.querySelector(".rating");
    var feedbackInput = document.getElementById("feedback");

    evaluationForm.addEventListener("submit", function (event) {
      event.preventDefault();
      clearInvalid(evaluationForm);

      var ratingInput = evaluationForm.querySelector('input[name="rating"]:checked');
      var problems = [];
      var firstInvalid = null;

      if (!completedOfferingSelect.value) {
        problems.push("No offering is selected.");
        markInvalid(completedOfferingSelect);
        firstInvalid = firstInvalid || completedOfferingSelect;
      }
      if (!ratingInput) {
        problems.push("No rating is given. Please click a star.");
        ratingGroup.classList.add("field-error");
        firstInvalid = firstInvalid || evaluationForm.querySelector('input[name="rating"]');
      }
      if (feedbackInput.value.trim() === "") {
        problems.push("The written feedback is empty.");
        markInvalid(feedbackInput);
        firstInvalid = firstInvalid || feedbackInput;
      }

      if (problems.length > 0) {
        showProblems("Your evaluation was not sent. Please fix the following:", problems);
        firstInvalid.focus();
        return;
      }

      var offeringName = completedOfferingSelect.options[completedOfferingSelect.selectedIndex].text;

      if (Number(ratingInput.value) >= 4) {
        alert("Thank you for rating \"" + offeringName + "\"! We are glad you enjoyed it.");
      } else {
        alert("We are sorry that \"" + offeringName + "\" did not meet your expectations. Thank you for your honest feedback; we will work to improve.");
      }
      window.location.href = "member-dashboard.html";
    });
  }
});

// Send Request
async function http(url, method = "GET", data = null) {
  const request = new Request(url, {
    headers: {
      "X-CSRFToken": data?.csrfmiddlewaretoken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  var response = await fetch(request, {
    method: method,
    mode: "same-origin",
    body: data ? JSON.stringify(data) : data,
  });
  // get data in view by -json.loads(request.body)
  const content = await response.json();
  return content;
}

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("scroll", () => {
    stickyNavbar();
  });

  function stickyNavbar() {
    const topNavbar = document.querySelector("#top-navbar");
    const sticky = topNavbar.offsetTop;
    var body = document.body,
      html = document.documentElement;

    var height = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );

    if (height > 1000 && window.pageYOffset >= sticky + 200) {
      topNavbar.classList.add("NavbarSticky");
    } else {
      topNavbar.classList.remove("NavbarSticky");
    }
  }

  // navmenu toggle button
  const toggleMenuBtn = document.querySelector("#toggle-menu-btn");
  const navMenu = document.querySelector("#nav-menu");
  const crossIcon = document.querySelector("#cross-icon");
  const menuIcon = document.querySelector("#menu-icon");

  toggleMenuBtn.addEventListener("click", () => {
    if (navMenu.classList.contains("hidden")) {
      navMenu.classList.remove("hidden");
      crossIcon.classList.remove("hidden");
      menuIcon.classList.add("hidden");
    } else {
      navMenu.classList.add("hidden");
      crossIcon.classList.add("hidden");
      menuIcon.classList.remove("hidden");
    }
  });

  //  handle mobile nav-link exception buttons
  document.addEventListener("click", (e) => {
    if (
      e.target.id == "non-link-menu-btn" ||
      e.target.parentElement.id == "non-link-menu-btn" ||
      e.target.parentElement.parentElement.id == "non-link-menu-btn" ||
      e.target.parentElement.parentElement.parentElement.id ==
        "non-link-menu-btn" ||
      e.target.id == "toggle-menu-btn" ||
      e.target.parentElement.id == "toggle-menu-btn" ||
      e.target.parentElement.parentElement.id == "toggle-menu-btn"
    ) {
    } else {
      navMenu.classList.add("hidden");
      crossIcon.classList.add("hidden");
      menuIcon.classList.remove("hidden");
    }
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 500,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  const toastCloseBtn = document.querySelectorAll(".close-toast");
  if (toastCloseBtn) {
    toastCloseBtn.forEach((element) => {
      element.addEventListener("click", () => {
        element.parentElement.remove();
      });
    });
  }
});

// Dark theme handle
document.addEventListener("DOMContentLoaded", () => {
  const lightModeBtns = document.querySelectorAll(".light-mode-btn");
  const darkModeBtns = document.querySelectorAll(".dark-mode-btn");
  const deviceModeBtns = document.querySelectorAll(".device-mode-btn");

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Whenever the user explicitly chooses light mode
  lightModeBtns.forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.theme = "light";
      if (document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.remove("dark");
      }
    });
  });

  // Whenever the user explicitly chooses dark mode
  darkModeBtns.forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.theme = "dark";
      if (!document.documentElement.classList.contains("dark")) {
        document.documentElement.classList.add("dark");
      }
    });
  });

  // Whenever the user explicitly chooses to respect the OS preference
  deviceModeBtns.forEach((element) => {
    element.addEventListener("click", () => {
      localStorage.removeItem("theme");
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    });
  });

  const branch = document.querySelector("#id_branch");
  const division = document.querySelector("#b_division");
  const branchType = document.querySelector("#b_type");

  division.addEventListener("change", (event) => {
    if (division.value !== "" && branchType !== "") {
      getBranches(branchType.value, division.value);
    }
  });
  branchType.addEventListener("change", (event) => {
    if (division.value !== "" && branchType !== "") {
      getBranches(branchType.value, division.value);
    }
  });

  async function getBranches(branchType, division) {
    const data = await http(
      `/branches/?branch_type=${branchType}&division=${division}`
    );
    console.log(data);
    if (data) {
      branch.innerHTML = "";
      data.forEach((element) => {
        let option = document.createElement("option");
        option.setAttribute("value", element.id);

        let optionText = document.createTextNode(element.name);
        option.appendChild(optionText);

        branch.appendChild(option);
      });
    }
  }
});

// end dark theme handle

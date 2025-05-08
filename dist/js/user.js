const apiURL = "http://api.mediminder.site";
let ID;
let openedId = 0;
let openedTab = "";

function closeModal() {
  const modal = document.querySelector(".modal");
  if (modal) modal.remove();
}

function convertTo12HourFormat(time) {
  let [hour, minute] = time.split(":"); // Split time into hour and minute
  hour = parseInt(hour); // Convert the hour to an integer for comparison

  let ampm = "AM"; // Default AM
  if (hour >= 12) {
    ampm = "PM"; // If hour is 12 or more, it's PM
    if (hour > 12) {
      hour -= 12; // Convert to 12-hour format
    }
  } else if (hour === 0) {
    hour = 12; // Midnight is 12 AM
  }

  // Format the hour and minute in 12-hour format
  return `${hour}:${minute} ${ampm}`;
}

function formatTakenTime(taken) {
  // Remove GMT, split the date and time, and keep both
  let parts = taken.replace("GMT", "").trim().split(" ");

  // Reformat time and keep the date part
  let formattedTime = convertTo12HourFormat(parts[4]);
  // return `${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]} ${formattedTime}`
  return parts;
}

const fetchUser = async () => {
  try {
    let api = apiURL + "/get_id";
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchUserDetails = async (ID) => {
  try {
    let api = apiURL + `/fetch_user/${ID}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchCount = async () => {
  try {
    let api = apiURL + `/count`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchPockets = async () => {
  try {
    let api = apiURL + `/fetch_pockets/${ID}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchRecords = async (pocketID) => {
  try {
    let api = apiURL + `/fetch_records/${pocketID}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const fetchPocket = async (ID) => {
  try {
    let api = apiURL + `/fetch_pocket/${ID}`;
    const response = await fetch(api);
    if (!response.ok) {
      throw new Error("Failed to fetch ID: " + response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

const updateUser = async (e, name) => {
  e.preventDefault();

  openUpdateModal(name);

  const updateUserForm = document.getElementById("updateUserForm");

  // Handle form submission
  updateUserForm.onsubmit = async (event) => {
    event.preventDefault();

    const data = new FormData(updateUserForm);
    const patchRequest = new XMLHttpRequest();
    patchRequest.open("PATCH", `${apiURL}/update_user/${ID}`, true);

    patchRequest.onload = async () => {
      if (patchRequest.status === 200) {
        // alert("User updated successfully!");
        closeModal();
        ID = await createPanel();
      } else {
        alert("An error occurred: " + patchRequest.statusText);
      }
    };

    patchRequest.send(data);
  };
};

function openUpdateModal(name) {
  // Check if the modal already exists
  if (!document.querySelector(".modal")) {
    const modalHTML = `
      <div class="modal">
          <div class="backdrop" onclick="closeModal()"></div>
          <form id="updateUserForm" class="userForm update">
              <h2 id="closeUpdateUserForm" class="closeUserForm" onclick="closeModal()">&times;</h2>
              <label>Name: <input type="text" id="updatedUserName" name="updatedUserName" placeholder="Enter name" value="${name}" required/></label>
              <input type="file" id="updatedUserImg" name="updatedUserImg" />
              <button class="btn primary" type="submit">Update</button>
          </form>
      </div>
    `;

    // Insert modal into the DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }
}

function activateSched(e, uid, stat) {
  e.preventDefault();

  // Get date and time inputs
  const dateInput = document.getElementById(`date-${uid}`);
  const timeInput = document.getElementById(`time-${uid}`);

  // Validate date and time
  if (
    !dateInput ||
    !timeInput ||
    !dateInput.textContent ||
    !timeInput.textContent
  ) {
    alert("Please set both date and time before activating the schedule.");
    return;
  }

  // Proceed with activation request
  const patchRequest = new XMLHttpRequest();
  patchRequest.open("PATCH", `${apiURL}/toggle_sched/${uid}/${stat}`, true);

  patchRequest.onload = () => {
    if (patchRequest.status === 200) {
      openTab(openedId, openedTab);
    } else {
      alert("An error occurred: " + patchRequest.statusText);
    }
  };

  patchRequest.send();
}

// function setSched(e, uid, date, time, hour, min) {
//   e.preventDefault();

//   openSetSchedModal(date, time, hour, min);

//   const setSchedForm = document.getElementById("setSchedForm");

//   // Handle form submission
//   setSchedForm.onsubmit = (event) => {
//     event.preventDefault();

//     const data = new FormData(setSchedForm);
//     const patchRequest = new XMLHttpRequest();
//     patchRequest.open("PATCH", `${apiURL}/set_sched/${uid}`, true);

//     patchRequest.onload = () => {
//       if (patchRequest.status === 200) {
//         closeModal();
//         updatePocket(openedId);
//       } else {
//         alert("An error occurred: " + patchRequest.statusText);
//       }
//     };

//     patchRequest.send(data);
//   };
// }

// function openSetSchedModal(date, time, hour, min) {
//   if (!document.querySelector(".modal")) {
//     // Get current date and time
//     const now = new Date();

//     // Ensure date format is consistent in YYYY-MM-DD (fixes timezone issue)
//     const today = now.toLocaleDateString("en-CA");

//     // Get the current time and add 10 minutes
//     now.setMinutes(now.getMinutes() + 1);
//     const futureHours = String(now.getHours()).padStart(2, "0");
//     const futureMinutes = String(now.getMinutes()).padStart(2, "0");
//     const futureTime = `${futureHours}:${futureMinutes}`;

//     // Ensure min is at least 1
//     min = Math.max(1, min || 1);

//     const modalHTML = `
//         <div class="modal">
//             <div class="backdrop" onclick="closeModal()"></div>
//             <form id="setSchedForm" class="userForm sched">
//                 <h2 id="closeSetSchedForm" class="closeUserForm" onclick="closeModal()">&times;</h2>
//                 <p>Date:</p>
//                 <input type="date" id="setDate" name="setDate" value="${today}" min="${today}"/>
//                 <p>Time:</p>
//                 <input type="time" id="setTime" name="setTime" value="${futureTime}" min="${futureTime}"/>
//                 <p>Interval:</p>
//                 <input class="step" type="number" id="setHour" name="setHour" value="${hour}" min="0"/>
//                 <small>:</small>
//                 <input class="step" type="number" id="setMin" name="setMin" value="${min}" min="1"/>
//                 <button class="btn primary" type="submit">Set</button>
//             </form>
//         </div>
//     `;

//     // Insert modal into the DOM
//     document.body.insertAdjacentHTML("beforeend", modalHTML);
//   }
// }

function setSched(e, uid, date, time, hour, min) {
  e.preventDefault();
  openSetSchedModal(uid, date, time, hour, min); // Pass uid too
}

function openSetSchedModal(uid, date, time, hour = 0, min = 1) {
  if (!document.querySelector(".modal")) {
    const now = new Date();
    const today = now.toLocaleDateString("en-CA");

    now.setMinutes(now.getMinutes() + 1); // set this to enforce the initial setup start of device
    const futureHours = String(now.getHours()).padStart(2, "0");
    const futureMinutes = String(now.getMinutes()).padStart(2, "0");
    const futureTime = `${futureHours}:${futureMinutes}`;

    const modalHTML = `
      <div class="modal">
        <div class="backdrop" onclick="closeModal()"></div>
        <form id="setSchedForm" class="userForm sched">
          <h2 id="closeSetSchedForm" class="closeUserForm" onclick="closeModal()">&times;</h2>
          <p>Date:</p>
          <input type="date" id="setDate" name="setDate" value="${today}" min="${today}" />
          <p>Time:</p>
          <input type="time" id="setTime" name="setTime" value="${futureTime}" min="${futureTime}" />
          <p>Interval:</p>
          <div class="flex gap-2">
            <input class="step" type="number" id="setHour" name="setHour" value="${hour}" min="0" />
            <small>:</small>
            <input class="step" type="number" id="setMin" name="setMin" value="${min}" min="0" />
          </div>
          <button class="btn primary" type="submit">Set</button>
        </form>
      </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // 💡 Bind form logic after modal is added
    const setSchedForm = document.getElementById("setSchedForm");
    setSchedForm.onsubmit = (event) => {
      event.preventDefault();

      const hourVal = parseInt(document.getElementById("setHour").value) || 0;
      const minVal = parseInt(document.getElementById("setMin").value) || 0;

      if (hourVal === 0 && minVal === 0) {
        alert("Interval cannot be 0 hours and 0 minutes.");
        return false;
      }

      const data = new FormData(setSchedForm);
      const patchRequest = new XMLHttpRequest();
      patchRequest.open("PATCH", `${apiURL}/set_sched/${uid}`, true);

      patchRequest.onload = () => {
        if (patchRequest.status === 200) {
          closeModal();
          openTab(openedId, openedTab);
        } else {
          alert("An error occurred: " + patchRequest.statusText);
        }
      };

      patchRequest.send(data);
    };
  }
}

const init = async () => {
  ID = await createPanel();
  createMainRecords();

  const menu = document.getElementById("panel__menu");
  const aside = document.querySelector("aside");
  menu.addEventListener("click", () => {
    aside.classList.toggle("open");
    closeModal();
  });

  document.addEventListener("click", (event) => {
    const isClickInside =
      aside.contains(event.target) || menu.contains(event.target);

    if (!isClickInside) {
      aside.classList.remove("open");
      closeModal(); 
    }
  });

  function resetOnSm(event) {
    if (event.matches) {
      aside.classList.remove("open");
    }
  }
  const smMediaQuery = window.matchMedia("(min-width: 640px)");
  resetOnSm(smMediaQuery);
  smMediaQuery.addEventListener("change", resetOnSm);
};

const createPanel = async () => {
  let user = await fetchUser();
  console.log(user);

  let panel = document.getElementById("panel__wrapper");

  if (panel) panel.innerHTML = "";
  panel.innerHTML += `
            <div class="profile">
              <img src="${apiURL}/get_image/${user.img_name}" alt=""/>
            </div>

            <div class="name">
              <h4>${user.name}</h4>
              <a onclick="updateUser(event, '${user.name}')"><img src="../img/edit.png" alt="" class="cursor-pointer"/></a>
            </div>

            <nav class="profile__nav nav">
              <a class="panelBtn" id="reportBtn" onclick="createMainReport()">
                <li>
                  <img src="../img/info.png" alt="" />
                  <p>User Report</p>
                </li>
              </a>
              <a class="panelBtn" id="recordBtn" onclick="createMainRecords()">
                <li>
                  <img src="../img/calendar.png" alt="" />
                  <p>Daily Records</p>
                </li>
              </a>
            </nav>
    `;

  return user.id;
};

const createMainRecords = async () => {
  const aside = document.querySelector("aside");
  aside.classList.remove("open");
  let main = document.getElementById("main");

  if (main) main.innerHTML = "";
  main.innerHTML += `
        <div class="record__wrapper">
            <div id="schedControls" class="schedControls">
              
            </div>

            <div id="schedTabs" class="schedTabs grid grid-flow-col grid-cols-5 rounded-[10px] bg-white">
 
            </div>

            <div class="schedHead grid">
              <p>Daily Time Records</p>
              <div class="schedCard head">
                <span class="font-bold">Date</span>
                <span class="font-bold">Drug</span>
                <span class="font-bold">Schedule</span>
                <span class="font-bold">Taken</span>
                <span class="font-bold">Status</span>
              </div>
            </div>

            <div id="schedRecords" class="schedRecords">
              
            </div>
          </div>
    `;

  document.getElementById("reportBtn").classList.remove("open");
  document.getElementById("recordBtn").classList.add("open");

  let pockets = await fetchPockets();
  console.log(pockets);

  let tabs = document.getElementById("schedTabs");
  if (tabs) tabs.innerHTML = "";

  tabs.innerHTML += `
        <span id="A" onclick="openTab(${pockets[0]}, 'A')" class="tabBtn rounded-l-[10px] disabled">A</span>
        <span id="B" onclick="openTab(${pockets[1]}, 'B')" class="tabBtn">B</span>
        <span id="C" onclick="openTab(${pockets[2]}, 'C')" class="tabBtn">C</span>
        <span id="D" onclick="openTab(${pockets[3]}, 'D')" class="tabBtn">D</span>
        <span id="E" onclick="openTab(${pockets[4]}, 'E')" class="tabBtn rounded-r-[10px] disabled">E</span>
    `;

  if (!openedId) {
    openedId = pockets[1];
    openedTab = "B";

    openTab(openedId, openedTab);
  } else {
    openTab(openedId, openedTab);
  }
};

const createMainReport = async () => {
  const aside = document.querySelector("aside");
  aside.classList.remove("open");
  let details = await fetchUserDetails(ID);

  console.log(details);

  let main = document.getElementById("main");
  if (main) main.innerHTML = "";

  main.innerHTML += `
        <div class="report__wrapper h-full flex flex-col gap-6 justify-start">
            <div class="demographic">
              <h4 class="font-bold">User Demographics</h4>
              <div
                class="demographic__wrapper"
              >
                <div class="demographic__col">
                  <p><strong>Name: </strong>${details.name}</p>
                  <p><strong>Age: </strong>${details.age}</p>
                  <p><strong>Sex: </strong>${details.sex}</p>
                </div>
                <div class="demographic__col">
                  <p><strong>Height: </strong>${details.height}cm</p>
                  <p><strong>Weight: </strong>${details.weight}kg</p>
                </div>
                <div class="demographic__col">
                  <p><strong>Contact No: </strong>${details.contact}</p>
                  <p><strong>Emergency No: </strong>${details.emergency}</p>
                </div>
                <div class="demographic__col">
                  <ul id="diseases" class="list-disc list-inside">
                    <p><strong>Disease/s: </strong></p>

                  </ul>
                </div>
              </div>
            </div>

            <div
              class="analytics"
            >
              <div class="summary">
                <div
                  class="summaryCard"
                >
                  <h4>Monthly General Adherence Status</h4>

                  <div
                    class="adherence"
                  >
                    <div class="adherenceGroup">
                      <p><strong>Most Adherent:</strong></p>
                      <div id="most" class="adherenceItems">
  
                      </div>
                    </div>
                    <div class="adherenceGroup">
                      <p><strong>Slightly Adherent:</strong></p>
                      <div id="slight" class="adherenceItems">
                        
                      </div>
                    </div>
                    <div class="adherenceGroup">
                      <p><strong>Non-Adherent:</strong></p>
                      <div id="non" class="adherenceItems">
                        
                      </div>
                    </div>
                  </div>

                  <div id="percent"
                    class="percent"
                  >

                  </div>
                </div>
              </div>
              <div class="summary">
                <div
                  class="summaryCard"
                >
                  <h4>
                    Weekly Missed Schedule
                  </h4>
                  <canvas id="missedChart" width="400" height="200"></canvas>
                </div>
              </div>
            </div>
          </div>
    `;

  let diseasesCont = document.getElementById("diseases");
  // Reset and clear previous <li> items (but keep the <strong>)
  if (diseasesCont) {
    // Remove all <li> elements, keeping <strong> intact
    while (
      diseasesCont.firstChild &&
      diseasesCont.firstChild.tagName === "LI"
    ) {
      diseasesCont.removeChild(diseasesCont.firstChild);
    }

    // Example: Add new <li> elements
    let diseases = details.diseases;

    diseases.forEach((disease) => {
      let newLi = document.createElement("li");
      newLi.textContent = disease;
      diseasesCont.appendChild(newLi);
    });
  }

  let count = await fetchCount();
  console.log(count);
  let most = document.getElementById("most");
  let slight = document.getElementById("slight");
  let non = document.getElementById("non");

  most.innerHTML = "<p>N/A</p>";
  slight.innerHTML = "<p>N/A</p>";
  non.innerHTML = "<p>N/A</p>";

  let total = 0;
  for (let label in count) {
    total += count[label].ratio;
    if (count[label].ratio >= 85) {
      if (most.innerHTML === "<p>N/A</p>") most.innerHTML = "";
      most.innerHTML += `
                <p>${label} (${count[label].ratio}%)</p>
            `;
    } else if (label.ratio >= 70) {
      if (slight.innerHTML === "<p>N/A</p>") slight.innerHTML = "";
      slight.innerHTML += `
                <p>${label} (${count[label].ratio}%)</p>
            `;
    } else {
      if (non.innerHTML === "<p>N/A</p>") non.innerHTML = "";
      non.innerHTML += `
                <p>${label} (${count[label].ratio}%)</p>
            `;
    }
  }

  let average = total / Object.keys(count).length;
  average = Math.round(average);

  const today = new Date();
  const month = today.toLocaleString("default", { month: "short" });

  let percent = document.getElementById("percent");
  if (percent) percent.innerHTML = "";

  let adherent = "";
  if (average > 85) {
    adherent = "(85%-100%)";
    percent.classList.add("bg-green-300");
  } else if (average > 70) {
    adherent = "(70%-84.9%)";
    percent.classList.add("bg-yellow-200");
  } else {
    adherent = "(Below 70%)";
    percent.classList.add("bg-red-200");
  }
  percent.innerHTML = `
        <h5 class="font-bold">${month}</h5>
        <h2 class="counter" data-target="${average}">0</h2>
        <span class="font-bold">Adherent</span>
        <h6>${adherent}</h6>
    `;

  graph(count);

  const counters = document.querySelectorAll(".counter");

  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const duration = 500; // total duration in ms
    const increment = target / (duration / 16); // assuming ~60fps (~16ms/frame)

    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = `${Math.ceil(current)}%`;
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = `${target}%`;
      }
    };

    updateCounter();
  });

  document.getElementById("recordBtn").classList.remove("open");
  document.getElementById("reportBtn").classList.add("open");
};

const graph = (count) => {
  const labels = Object.keys(count); // e.g., ["B", "C", "D"]
  const values = labels.map((key) => count[key].missed); // e.g., [0, 3, 1]

  const missedChart = document.getElementById("missedChart");
  const ctx = document.getElementById("missedChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Missed Schedules",
          data: values,
          backgroundColor: "#5d2962",
          borderRadius: 5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            callback: function (value) {
              return Number.isInteger(value) ? value : null;
            },
          },
        },
      },
    },
  });

  missedChart.style.width = "100%";
};

function openRenameLabelModal(name) {
  if (!document.querySelector(".modal")) {
    const modalHTML = `
        <div class="modal">
            <div class="backdrop" onclick="closeModal()"></div>
            <form id="renameLabelForm" class="userForm label">
                <h2 id="closeRenameLabelForm" class="closeUserForm" onclick="closeModal()">&times;</h2>
                <p>Drug Name:</p>
                <input type="text" id="renameLabel" name="renameLabel" value="${name}"/>
                <button class="btn primary" type="submit">Rename</button>
            </form>
        </div>
    `;

    // Insert modal into the DOM
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }
}

function renameLabel(e, uid, name) {
  e.preventDefault();

  openRenameLabelModal(name);

  const renameLabelForm = document.getElementById("renameLabelForm");

  // Handle form submission
  renameLabelForm.onsubmit = (event) => {
    event.preventDefault();

    const data = new FormData(renameLabelForm);
    const patchRequest = new XMLHttpRequest();
    patchRequest.open("PATCH", `${apiURL}/rename_label/${uid}`, true);

    patchRequest.onload = () => {
      if (patchRequest.status === 200) {
        // alert("Medication renamed successfully!");
        closeModal();
        activateSched(e, uid, 0);
      } else {
        alert("An error occurred: " + patchRequest.statusText);
      }
    };

    patchRequest.send(data);
  };
}

const updateRecords = async (pocketID, tabId) => {
  let records = await fetchRecords(pocketID);
  console.log(records);

  let recordsContainer = document.getElementById("schedRecords");
  if (recordsContainer) recordsContainer.innerHTML = "";

  records.forEach((record) => {
    const [date, time] = record.sched.split(" ");

    const dateObj = new Date(date);
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const date_ = dateObj.getDate();
    const day = dateObj.toLocaleString("en-US", { weekday: "short" });

    let formattedTime = convertTo12HourFormat(time);

    let time__;
    let date__;
    if (!record.taken) {
      time__ = "";
      date__ = "";
    } else {
      let taken = formatTakenTime(record.taken);
      time__ = convertTo12HourFormat(taken[4]);
      date__ = `${taken[2]} ${taken[1]}`;
    }

    if (!record.status) {
      record.status = "";
    }

    recordsContainer.innerHTML += `
        <div class="schedCard">
            <div class="schedCard__date">
                <h6>${month}</h6>
                <h4>${date_}</h4>
                <h6>${day}</h6>
            </div>
            <p>${record.label}</p>
            <p>${formattedTime}</p>
            <div class="schedCard__date">
                <p>${time__}</p>
                <h6>${date__}</h6>
            </div>
            <p>${record.status}</p>
        </div>
    `;
  });

  let tabs = document.querySelectorAll(".tabBtn");
  tabs.forEach((tab) => {
    tab.classList.remove("open");
  });
  document.getElementById(tabId).classList.add("open");
};

const updatePocket = async (pocketID) => {
  let pocket = await fetchPocket(pocketID);
  console.log(pocket);

  let [date, time] = ["", ""];
  let formattedTime = "";
  let step = "";

  if (pocket.start != "") {
    [date, time] = pocket.start.split(" ");
    formattedTime = convertTo12HourFormat(time);
  }

  if (pocket.hour != 0 || pocket.min != 0) {
    step = `${pocket.hour}hr : ${pocket.min}min`;
  }

  let stat = 0;
  if (pocket.status == "Deactivated") {
    stat = 1;
    pocket.status = "Activate";
  }

  let controls = document.getElementById("schedControls");
  if (controls) controls.innerHTML = "";
  controls.innerHTML += `
        <div class="schedDetails">
            <div
                class="schedDetails__head"
            >
                <p>Drug Name</p>
                <p>Start Date</p>
                <p>Start Time</p>
                <p>Interval</p>
            </div>
            <div
                class="schedDetails__body"
            >
                <div class="flex justify-between items-center gap-2">
                    <p>${pocket.label}</p>
                    <img src="../img/edit.png" alt="" onclick="renameLabel(event, ${pocket.uid}, '${pocket.label}')" class="cursor-pointer">
                </div>
                <p id=date-${pocket.uid}>${date}</p>
                <p id=time-${pocket.uid}>${formattedTime}</p>
                <p>${step}</p>
            </div>
        </div>
        
        <div class="schedBtn">
            <span onclick="setSched(event, ${pocket.uid}, '${date}', '${time}', '${pocket.hour}', '${pocket.min}')">
              <p>Edit</p>
            </span>
            <span id="activate-${pocket.uid}" onclick="activateSched(event, ${pocket.uid}, ${stat})">
              <p>${pocket.status}</p>
            </span>
        </div>
    `;

  if (pocket.status === "Activated") {
    document
      .getElementById(`activate-${pocket.uid}`)
      .classList.remove("bg-accent");
    document
      .getElementById(`activate-${pocket.uid}`)
      .classList.add("bg-green-300");
  } else {
    document
      .getElementById(`activate-${pocket.uid}`)
      .classList.remove("bg-green-300");
    document
      .getElementById(`activate-${pocket.uid}`)
      .classList.add("bg-accent");
  }
};

const openTab = async (pocketID, tabId) => {
  updateRecords(pocketID, tabId);
  updatePocket(pocketID);

  openedId = pocketID;
  openedTab = tabId;
};

init();

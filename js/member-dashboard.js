/* Wanderly - Phase 3: Club Member Dashboard
   Displays the member's previous participation requests. */

document.addEventListener("DOMContentLoaded", function () {
  var requestTable = document.getElementById("previous-requests");

  if (!requestTable) return;

  // Previous requests for the current demo member.
  // New requests submitted from the Request to Join page are temporary
  // and are intentionally not stored here, as required by Phase 3.
  var previousRequests = [
    { offering: "AlUla Heritage Trip", date: "10/10/2026", cost: "$0", status: "Pending", statusClass: "status-pending" },
    { offering: "Red Sea Snorkeling", date: "12/10/2026", cost: "$150", status: "Declined", statusClass: "status-declined" },
    { offering: "Diriyah Heritage Walk", date: "15/10/2026", cost: "$0", status: "Completed", statusClass: "status-completed" },
    { offering: "Abha Mountains Trip", date: "20/10/2026", cost: "$85", status: "Pending", statusClass: "status-pending" }
  ];

  requestTable.innerHTML = "";

  previousRequests.forEach(function (request) {
    var row = document.createElement("tr");

    [request.offering, request.date, request.cost].forEach(function (value) {
      var cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    var statusCell = document.createElement("td");
    var statusLabel = document.createElement("span");
    statusLabel.className = "status " + request.statusClass;
    statusLabel.textContent = request.status;
    statusCell.appendChild(statusLabel);
    row.appendChild(statusCell);

    requestTable.appendChild(row);
  });

  if (previousRequests.length === 0) {
    var emptyRow = document.createElement("tr");
    var emptyCell = document.createElement("td");
    emptyCell.colSpan = 4;
    emptyCell.textContent = "You have no previous participation requests.";
    emptyRow.appendChild(emptyCell);
    requestTable.appendChild(emptyRow);
  }
});

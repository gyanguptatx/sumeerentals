const phone = "+14696667742";

document.getElementById("year").textContent = new Date().getFullYear();

const dateInput = document.getElementById("date");
const today = new Date();
today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
dateInput.min = today.toISOString().split("T")[0];

document.getElementById("quoteForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const city = document.getElementById("city").value.trim();
  const guests = document.getElementById("guests").value.trim();
  const items = document.getElementById("items").value.trim();

  const message =
`Hi SuMee Party Rentals! I'd like a quote.

Name: ${name}
Event date: ${date}
Event city: ${city}
Estimated guests: ${guests || "Not sure"}
Rentals needed: ${items}`;

  window.location.href = `sms:${phone}?&body=${encodeURIComponent(message)}`;
});

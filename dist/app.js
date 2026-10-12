"use strict";
// En tom array. Den skapas på nytt när sidan laddas om.
const people = [];
// Hämta HTML-elementen med deras id.
// as anger vilken elementtyp vi förväntar oss.
const form = document.getElementById("person-form");
const firstNameInput = document.getElementById("first-name");
const dateOfBirthInput = document.getElementById("date-of-birth");
const maritalStatusSelect = document.getElementById("marital-status");
const errorMessage = document.getElementById("error-message");
const peopleList = document.getElementById("people-list");
const emptyMessage = document.getElementById("empty-message");
const peopleCount = document.getElementById("people-count");
// En tom sträng betyder att alla kontroller är godkända.
function validateInput(firstName, dateOfBirth, maritalStatus) {
    if (firstName.length === 0 || firstName.length > 50) {
        return "Förnamnet måste innehålla 1–50 tecken.";
    }
    // T00:00:00 gör datumet till midnatt i lokal tid.
    const birthDate = new Date(dateOfBirth + "T00:00:00");
    // Datumfältets validity kan läsas även med novalidate.
    if (dateOfBirth === "" ||
        !dateOfBirthInput.validity.valid ||
        Number.isNaN(birthDate.getTime())) {
        return "Ange ett giltigt födelsedatum.";
    }
    // Jämför datum utan att klockslaget påverkar resultatet.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (birthDate > today) {
        return "Födelsedatum får inte ligga i framtiden.";
    }
    // Select-värden är text, även när de heter true/false.
    if (maritalStatus !== "true" && maritalStatus !== "false") {
        return "Välj Gift eller Singel.";
    }
    return "";
}
// void betyder att funktionen inte returnerar något värde.
function renderPeople() {
    // Töm den synliga listan så att vi inte får dubbla rader.
    // Detta tömmer INTE vår array.
    peopleList.textContent = "";
    // Dölj tom-meddelandet när arrayen innehåller personer.
    emptyMessage.hidden = people.length > 0;
    // length är antalet objekt som finns i arrayen.
    peopleCount.textContent = "Antal personer: " + people.length;
    // Gå igenom alla personer i arrayen.
    for (const person of people) {
        const listItem = document.createElement("li");
        // Översätt boolean-värdet till en läsbar text.
        const maritalStatus = person.isMarried ? "Gift" : "Singel";
        // textContent visar namnet som text, inte som HTML.
        listItem.textContent =
            person.firstName + " | " + person.dateOfBirth + " | " + maritalStatus;
        peopleList.appendChild(listItem);
    }
}
// Körs när användaren skickar formuläret.
form.addEventListener("submit", (event) => {
    // Hindra formulärets vanliga omladdning av sidan.
    event.preventDefault();
    // trim tar bort mellanslag i början och slutet.
    const firstName = firstNameInput.value.trim();
    const dateOfBirth = dateOfBirthInput.value;
    const maritalStatus = maritalStatusSelect.value;
    const error = validateInput(firstName, dateOfBirth, maritalStatus);
    errorMessage.textContent = error;
    // Avsluta direkt vid fel. Ingen person läggs till.
    if (error !== "") {
        return;
    }
    const person = {
        firstName: firstName,
        dateOfBirth: dateOfBirth,
        // Jämförelsen ger en riktig boolean: true eller false.
        isMarried: maritalStatus === "true",
    };
    people.push(person); // Lägg personen sist i arrayen.
    renderPeople(); // Uppdatera listan på sidan direkt.
    form.reset(); // Töm formuläret, inte arrayen.
    firstNameInput.focus();
});
// Visa rätt startläge när sidan öppnas.
renderPeople();

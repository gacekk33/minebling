const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

navItems.forEach((item) => {

    item.addEventListener("click", () => {

        const pageName = item.dataset.page;

        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        pages.forEach((page) => {
            page.classList.remove("active-page");
        });

        item.classList.add("active");

        const selectedPage = document.getElementById(pageName);

        if (selectedPage) {
            selectedPage.classList.add("active-page");
        }

    });

});


/* =========================
   DEMO BALANCE
========================= */

let balance = 10000;
let casesOpened = 0;

const balanceElement =
    document.getElementById("balance");

const casesOpenedElement =
    document.getElementById("casesOpened");


function updateBalance() {

    balanceElement.textContent =
        balance.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

}


function fakeOpenCase(price) {

    if (balance < price) {

        alert("Not enough Coins!");

        return;
    }

    balance -= price;

    casesOpened++;

    updateBalance();

    casesOpenedElement.textContent =
        casesOpened;

}


/* FEATURED CASE */

const openButton =
    document.querySelector(".open-button");

openButton.addEventListener("click", () => {

    const price =
        Number(openButton.dataset.price);

    fakeOpenCase(price);

});


/* NORMAL CASES */

const caseButtons =
    document.querySelectorAll(".case-price");

caseButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const price =
            Number(button.dataset.price);

        fakeOpenCase(price);

    });

});


updateBalance();

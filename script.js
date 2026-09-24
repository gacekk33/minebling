// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://guunztesvywkqvqivkrp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_GrxSrKLvMNoMlEfR_VWRxA_97Ouydqw";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ==========================================
// ELEMENTS
// ==========================================

const guestButtons =
    document.getElementById("guestButtons");

const userArea =
    document.getElementById("userArea");

const balanceElement =
    document.getElementById("balance");

const profileBalance =
    document.getElementById("profileBalance");

const usernameDisplay =
    document.getElementById("usernameDisplay");

const menuUsername =
    document.getElementById("menuUsername");

const playerIdElement =
    document.getElementById("playerId");

const accountStatus =
    document.getElementById("accountStatus");

const casesOpenedElement =
    document.getElementById("casesOpened");

const bestDropElement =
    document.getElementById("bestDrop");

const upgradesWonElement =
    document.getElementById("upgradesWon");


// AUTH ELEMENTS

const authModal =
    document.getElementById("authModal");

const authMessage =
    document.getElementById("authMessage");

const loginOpen =
    document.getElementById("loginOpen");

const registerOpen =
    document.getElementById("registerOpen");

const closeModal =
    document.getElementById("closeModal");

const loginTab =
    document.getElementById("loginTab");

const registerTab =
    document.getElementById("registerTab");

const loginForm =
    document.getElementById("loginForm");

const registerForm =
    document.getElementById("registerForm");


// PROFILE

const profileButton =
    document.getElementById("profileButton");

const profileMenu =
    document.getElementById("profileMenu");

const logoutButton =
    document.getElementById("logoutButton");


// ==========================================
// NAVIGATION
// ==========================================

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");


navItems.forEach(item => {

    item.addEventListener("click", () => {

        const target =
            item.dataset.page;

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        item.classList.add("active");

        const page =
            document.getElementById(target);

        if (page) {
            page.classList.add("active-page");
        }

    });

});


// ==========================================
// AUTH MODAL
// ==========================================

function resetAuthMessage() {

    authMessage.textContent = "";
    authMessage.style.color = "#ff6878";

}


function showLogin() {

    loginTab.classList.add("active");
    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

}


function showRegister() {

    registerTab.classList.add("active");
    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

}


function openAuth(type = "login") {

    authModal.classList.remove("hidden");

    resetAuthMessage();

    if (type === "register") {
        showRegister();
    } else {
        showLogin();
    }

}


function closeAuth() {

    authModal.classList.add("hidden");

    resetAuthMessage();

}


loginOpen.addEventListener(
    "click",
    () => openAuth("login")
);

registerOpen.addEventListener(
    "click",
    () => openAuth("register")
);

loginTab.addEventListener(
    "click",
    showLogin
);

registerTab.addEventListener(
    "click",
    showRegister
);

closeModal.addEventListener(
    "click",
    closeAuth
);

document
    .querySelector(".modal-overlay")
    .addEventListener(
        "click",
        closeAuth
    );


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        resetAuthMessage();


        const username =
            document
                .getElementById("registerUsername")
                .value
                .trim();


        const email =
            document
                .getElementById("registerEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("registerPassword")
                .value;


        const usernameRegex =
            /^[a-zA-Z0-9_]+$/;


        if (
            username.length < 3 ||
            username.length > 20
        ) {

            authMessage.textContent =
                "Username must have 3-20 characters.";

            return;
        }


        if (!usernameRegex.test(username)) {

            authMessage.textContent =
                "Username can contain letters, numbers and _";

            return;
        }


        authMessage.style.color =
            "#999fa9";

        authMessage.textContent =
            "Creating account...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email,

                    password,

                    options: {

                        data: {
                            username
                        }

                    }

                });


        if (error) {

            authMessage.style.color =
                "#ff6878";

            authMessage.textContent =
                error.message;

            return;
        }


        authMessage.style.color =
            "#aaff00";


        if (!data.session) {

            authMessage.textContent =
                "Account created. Confirm email if required.";

            return;
        }


        authMessage.textContent =
            "Account created!";


        registerForm.reset();


        setTimeout(
            closeAuth,
            600
        );

    }
);


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        resetAuthMessage();


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();


        const password =
            document
                .getElementById("loginPassword")
                .value;


        authMessage.style.color =
            "#999fa9";

        authMessage.textContent =
            "Logging in...";


        const {
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({
                    email,
                    password
                });


        if (error) {

            authMessage.style.color =
                "#ff6878";

            authMessage.textContent =
                "Invalid email or password.";

            return;
        }


        authMessage.style.color =
            "#aaff00";

        authMessage.textContent =
            "Logged in!";


        loginForm.reset();


        setTimeout(
            closeAuth,
            500
        );

    }
);


// ==========================================
// FORMAT PLAYER ID
// ==========================================

function formatPlayerId(id) {

    if (
        id === null ||
        id === undefined
    ) {
        return "#00000";
    }


    return (
        "#" +
        String(id).padStart(
            5,
            "0"
        )
    );

}


// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile(user) {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(`
                player_id,
                username,
                coins,
                cases_opened,
                best_drop,
                upgrades_won,
                upgrades_total
            `)
            .eq(
                "id",
                user.id
            )
            .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return;
    }


    const username =
        data.username || "Player";


    const coins =
        Number(
            data.coins || 0
        );


    usernameDisplay.textContent =
        username;

    menuUsername.textContent =
        username;


    playerIdElement.textContent =
        formatPlayerId(
            data.player_id
        );


    balanceElement.textContent =
        coins.toFixed(2);


    profileBalance.textContent =
        `${coins.toFixed(2)} Coins`;


    casesOpenedElement.textContent =
        data.cases_opened ?? 0;


    bestDropElement.textContent =
        Number(
            data.best_drop ?? 0
        ).toFixed(2);


    upgradesWonElement.textContent =
        `${data.upgrades_won ?? 0} / ${data.upgrades_total ?? 0}`;


    accountStatus.textContent =
        "ONLINE";

}


// ==========================================
// UPDATE AUTH UI
// ==========================================

async function updateAuthUI() {

    const {
        data: {
            session
        }
    } =
        await supabaseClient
            .auth
            .getSession();


    if (!session) {

        guestButtons.classList.remove(
            "hidden"
        );

        userArea.classList.add(
            "hidden"
        );

        accountStatus.textContent =
            "GUEST";

        return;
    }


    guestButtons.classList.add(
        "hidden"
    );

    userArea.classList.remove(
        "hidden"
    );


    await loadProfile(
        session.user
    );

}


// ==========================================
// AUTH STATE
// ==========================================

supabaseClient.auth
    .onAuthStateChange(
        (event, session) => {

            if (session) {

                guestButtons.classList.add(
                    "hidden"
                );

                userArea.classList.remove(
                    "hidden"
                );


                setTimeout(
                    () => {

                        loadProfile(
                            session.user
                        );

                    },
                    0
                );

            } else {

                guestButtons.classList.remove(
                    "hidden"
                );

                userArea.classList.add(
                    "hidden"
                );

                accountStatus.textContent =
                    "GUEST";

            }

        }
    );


// ==========================================
// PROFILE DROPDOWN
// ==========================================

profileButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();

        profileMenu.classList.toggle(
            "hidden"
        );

    }
);


document.addEventListener(
    "click",
    event => {

        if (
            !profileMenu.contains(
                event.target
            ) &&
            !profileButton.contains(
                event.target
            )
        ) {

            profileMenu.classList.add(
                "hidden"
            );

        }

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    async () => {

        await supabaseClient
            .auth
            .signOut();


        profileMenu.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// CASE CLICK
// ==========================================

const caseButtons =
    document.querySelectorAll(
        ".case-open"
    );


caseButtons.forEach(button => {

    button.addEventListener(
        "click",
        async () => {

            const {
                data: {
                    session
                }
            } =
                await supabaseClient
                    .auth
                    .getSession();


            if (!session) {

                openAuth("login");

                authMessage.textContent =
                    "Login to open cases.";

                return;
            }


            const caseName =
                button.dataset.case;

            const title =
                button.dataset.title;

            const price =
                Number(
                    button.dataset.price
                );


            console.log({
                caseName,
                title,
                price
            });


            /*
                NASTĘPNY ETAP:

                openCase(caseName)

                Backend Supabase:
                - sprawdza saldo
                - odejmuje cenę
                - losuje drop
                - zapisuje drop
                - zwiększa cases_opened
                - zwraca wynik

                Frontend:
                - uruchamia animację
                - pokazuje wylosowany item
            */


            alert(
                `${title}\n${price} Coins\n\nOpening animation coming next.`
            );

        }
    );

});


// ==========================================
// START
// ==========================================

updateAuthUI();

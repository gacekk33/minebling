// ==========================================
// MINEBLING + SUPABASE
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

const usernameDisplay =
    document.getElementById("usernameDisplay");

const menuUsername =
    document.getElementById("menuUsername");

const accountStatus =
    document.getElementById("accountStatus");

const casesOpened =
    document.getElementById("casesOpened");

const bestDrop =
    document.getElementById("bestDrop");

const upgradesWon =
    document.getElementById("upgradesWon");


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

        const pageName =
            item.dataset.page;

        navItems.forEach(nav => {
            nav.classList.remove("active");
        });

        pages.forEach(page => {
            page.classList.remove("active-page");
        });

        item.classList.add("active");

        const page =
            document.getElementById(pageName);

        if (page) {
            page.classList.add("active-page");
        }

    });

});


// ==========================================
// AUTH MODAL
// ==========================================

function openAuth(mode) {

    authModal.classList.remove("hidden");

    authMessage.textContent = "";

    if (mode === "register") {
        showRegister();
    } else {
        showLogin();
    }

}


function closeAuth() {

    authModal.classList.add("hidden");

    authMessage.textContent = "";

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


loginOpen.addEventListener(
    "click",
    () => openAuth("login")
);


registerOpen.addEventListener(
    "click",
    () => openAuth("register")
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


loginTab.addEventListener(
    "click",
    showLogin
);


registerTab.addEventListener(
    "click",
    showRegister
);


// ==========================================
// REGISTER
// ==========================================

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        authMessage.textContent =
            "Creating account...";


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


        if (
            username.length < 3 ||
            username.length > 20
        ) {

            authMessage.textContent =
                "Username must have 3-20 characters.";

            return;
        }


        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: password,

                options: {

                    data: {
                        username: username
                    }

                }

            });


        if (error) {

            authMessage.textContent =
                error.message;

            return;
        }


        /*
        Jeśli Supabase ma włączone
        potwierdzanie emaila, session
        będzie puste do momentu
        potwierdzenia maila.
        */

        if (!data.session) {

            authMessage.style.color =
                "#aaff00";

            authMessage.textContent =
                "Account created! Check your email.";

            return;
        }


        authMessage.style.color =
            "#aaff00";

        authMessage.textContent =
            "Account created!";


        setTimeout(() => {

            closeAuth();

        }, 700);

    }
);


// ==========================================
// LOGIN
// ==========================================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();

        authMessage.style.color =
            "#ff6878";

        authMessage.textContent =
            "Logging in...";


        const email =
            document
                .getElementById("loginEmail")
                .value
                .trim();

        const password =
            document
                .getElementById("loginPassword")
                .value;


        const { error } =
            await supabaseClient.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        if (error) {

            authMessage.textContent =
                "Invalid email or password.";

            return;
        }


        authMessage.style.color =
            "#aaff00";

        authMessage.textContent =
            "Logged in!";


        setTimeout(() => {

            closeAuth();

        }, 500);

    }
);


// ==========================================
// GET PROFILE
// ==========================================

async function loadProfile(user) {

    const { data, error } =
        await supabaseClient
            .from("profiles")
            .select(`
                username,
                coins,
                cases_opened,
                best_drop,
                upgrades_won,
                upgrades_total
            `)
            .eq("id", user.id)
            .single();


    if (error) {

        console.error(
            "Profile error:",
            error
        );

        return;
    }


    usernameDisplay.textContent =
        data.username || "Player";

    menuUsername.textContent =
        data.username || "Player";


    balanceElement.textContent =
        Number(data.coins).toFixed(2);


    casesOpened.textContent =
        data.cases_opened;


    bestDrop.textContent =
        Number(data.best_drop).toFixed(2);


    upgradesWon.textContent =
        `${data.upgrades_won} / ${data.upgrades_total}`;


    accountStatus.textContent =
        "ONLINE";

}


// ==========================================
// AUTH UI
// ==========================================

async function updateAuthUI() {

    const {
        data: { session }
    } =
        await supabaseClient.auth
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
// AUTH STATE CHANGES
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


                setTimeout(() => {

                    loadProfile(
                        session.user
                    );

                }, 0);

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
// PROFILE MENU
// ==========================================

profileButton.addEventListener(
    "click",
    () => {

        profileMenu.classList.toggle(
            "hidden"
        );

    }
);


// ==========================================
// LOGOUT
// ==========================================

logoutButton.addEventListener(
    "click",
    async () => {

        await supabaseClient.auth
            .signOut();

        profileMenu.classList.add(
            "hidden"
        );

    }
);


// ==========================================
// DISABLE CASE OPENING FOR NOW
// ==========================================

document
    .querySelectorAll(
        ".case-price, .open-button"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const {
                    data: { session }
                } =
                    await supabaseClient.auth
                        .getSession();


                if (!session) {

                    openAuth("login");

                    authMessage.textContent =
                        "Login to open cases.";

                    return;
                }


                alert(
                    "Case opening will be added next!"
                );

            }
        );

    });


// ==========================================
// START
// ==========================================

updateAuthUI();

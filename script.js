// ============================================
// MINEBLING
// SUPABASE
// ============================================

const SUPABASE_URL =
    "https://guunztesvywkqvqivkrp.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_GrxSrKLvMNoMlEfR_VWRxA_97Ouydqw";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


// ============================================
// ELEMENTS
// ============================================

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

const casesOpenedElement =
    document.getElementById("casesOpened");

const bestDropElement =
    document.getElementById("bestDrop");

const upgradesWonElement =
    document.getElementById("upgradesWon");


// AUTH

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


// ============================================
// NAVIGATION
// ============================================

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");


navItems.forEach(item => {

    item.addEventListener(
        "click",
        () => {

            const pageName =
                item.dataset.page;


            navItems.forEach(nav => {

                nav.classList.remove(
                    "active"
                );

            });


            pages.forEach(page => {

                page.classList.remove(
                    "active-page"
                );

            });


            item.classList.add(
                "active"
            );


            const selectedPage =
                document.getElementById(
                    pageName
                );


            if (selectedPage) {

                selectedPage.classList.add(
                    "active-page"
                );

            }

        }
    );

});


// ============================================
// AUTH MODAL
// ============================================

function resetAuthMessage() {

    authMessage.textContent = "";

    authMessage.style.color =
        "#ff6878";

}


function openAuth(mode) {

    authModal.classList.remove(
        "hidden"
    );

    resetAuthMessage();


    if (mode === "register") {

        showRegister();

    } else {

        showLogin();

    }

}


function closeAuth() {

    authModal.classList.add(
        "hidden"
    );

    resetAuthMessage();

}


function showLogin() {

    loginTab.classList.add(
        "active"
    );

    registerTab.classList.remove(
        "active"
    );


    loginForm.classList.remove(
        "hidden"
    );

    registerForm.classList.add(
        "hidden"
    );

}


function showRegister() {

    registerTab.classList.add(
        "active"
    );

    loginTab.classList.remove(
        "active"
    );


    registerForm.classList.remove(
        "hidden"
    );

    loginForm.classList.add(
        "hidden"
    );

}


// ============================================
// AUTH BUTTONS
// ============================================

loginOpen.addEventListener(
    "click",
    () => {

        openAuth("login");

    }
);


registerOpen.addEventListener(
    "click",
    () => {

        openAuth("register");

    }
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


// ============================================
// REGISTER
// ============================================

registerForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        resetAuthMessage();


        const username =
            document
                .getElementById(
                    "registerUsername"
                )
                .value
                .trim();


        const email =
            document
                .getElementById(
                    "registerEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "registerPassword"
                )
                .value;


        // USERNAME VALIDATION

        if (
            username.length < 3 ||
            username.length > 20
        ) {

            authMessage.textContent =
                "Username must have 3-20 characters.";

            return;

        }


        // SIMPLE USERNAME FORMAT

        const usernameRegex =
            /^[a-zA-Z0-9_]+$/;


        if (
            !usernameRegex.test(
                username
            )
        ) {

            authMessage.textContent =
                "Use only letters, numbers and _";

            return;

        }


        authMessage.style.color =
            "#9da3ad";

        authMessage.textContent =
            "Creating account...";


        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {
                            username: username
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
                "Account created. Confirm your email.";

            return;

        }


        authMessage.textContent =
            "Account created!";


        registerForm.reset();


        setTimeout(
            () => {

                closeAuth();

            },
            600
        );

    }
);


// ============================================
// LOGIN
// ============================================

loginForm.addEventListener(
    "submit",
    async event => {

        event.preventDefault();


        resetAuthMessage();


        const email =
            document
                .getElementById(
                    "loginEmail"
                )
                .value
                .trim();


        const password =
            document
                .getElementById(
                    "loginPassword"
                )
                .value;


        authMessage.style.color =
            "#9da3ad";

        authMessage.textContent =
            "Logging in...";


        const {
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password

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
            () => {

                closeAuth();

            },
            500
        );

    }
);


// ============================================
// LOAD PROFILE
// ============================================

async function loadProfile(user) {

    const {
        data,
        error
    } =
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
            .eq(
                "id",
                user.id
            )
            .single();


    if (error) {

        console.error(
            "PROFILE ERROR:",
            error
        );

        return;

    }


    const username =
        data.username || "Player";


    usernameDisplay.textContent =
        username;


    menuUsername.textContent =
        username;


    balanceElement.textContent =
        Number(
            data.coins
        ).toFixed(2);


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


// ============================================
// AUTH UI
// ============================================

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


// ============================================
// AUTH CHANGES
// ============================================

supabaseClient
    .auth
    .onAuthStateChange(
        (event, session) => {

            if (session) {

                guestButtons
                    .classList
                    .add(
                        "hidden"
                    );


                userArea
                    .classList
                    .remove(
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

                guestButtons
                    .classList
                    .remove(
                        "hidden"
                    );


                userArea
                    .classList
                    .add(
                        "hidden"
                    );


                accountStatus.textContent =
                    "GUEST";

            }

        }
    );


// ============================================
// PROFILE MENU
// ============================================

profileButton.addEventListener(
    "click",
    event => {

        event.stopPropagation();


        profileMenu
            .classList
            .toggle(
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

            profileMenu
                .classList
                .add(
                    "hidden"
                );

        }

    }
);


// ============================================
// LOGOUT
// ============================================

logoutButton.addEventListener(
    "click",
    async () => {

        await supabaseClient
            .auth
            .signOut();


        profileMenu
            .classList
            .add(
                "hidden"
            );

    }
);


// ============================================
// CASE BUTTONS
// ============================================

const caseButtons =
    document.querySelectorAll(
        ".case-price, .open-button"
    );


caseButtons.forEach(
    button => {

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


                // LOGIN REQUIRED

                if (!session) {

                    openAuth(
                        "login"
                    );


                    authMessage.textContent =
                        "Login to open cases.";

                    return;

                }


                const caseName =
                    button.dataset.case;


                console.log(
                    "Selected case:",
                    caseName
                );


                /*
                ==================================
                NEXT STEP:

                tutaj dodamy:

                1. ekran otwierania skrzynki
                2. listę dropów
                3. animację przewijania
                4. losowanie po stronie Supabase
                5. odejmowanie Coins
                6. inventory
                ==================================
                */

                alert(
                    `${caseName.toUpperCase()} CASE - opening system coming next!`
                );

            }
        );

    }
);


// ============================================
// START
// ============================================

updateAuthUI();

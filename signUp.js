document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("signup-form");
    if (!form) return; // Prevents JS crash if form is missing

    // Get form elements
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const termsCheckbox = document.getElementById("terms");
    const registerButton = document.querySelector("button[type=\"submit\"]");

    // Error spans
    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const passwordError = document.getElementById("password-error");
    const confirmPasswordError = document.getElementById("confirm-password-error");
    const termsError = document.getElementById("terms-error");

    // Basic profanity filter (expand as needed)
    const blockedUsernames = [
        "bordel",
        "buzna",
        "čumět",
        "čurák",
        "debil",
        "do piče",
        "do prdele",
        "dršťka",
        "držka",
        "flundra",
        "hajzl",
        "hovno",
        "chcanky",
        "chuj",
        "jebat",
        "kokot",
        "kokotina",
        "koňomrd",
        "kunda",
        "kurva",
        "mamrd",
        "mrdat",
        "mrdka",
        "mrdník",
        "oslošoust",
        "piča",
        "píčus",
        "píchat",
        "pizda",
        "prcat",
        "prdel",
        "prdelka",
        "sračka",
        "srát",
        "šoustat",
        "šulin",
        "vypíčenec",
        "zkurvit",
        "zkurvysyn",
        "zmrd",
        "žrát",

        "سكس",
        "طيز",
        "شرج",
        "لعق",
        "لحس",
        "مص",
        "تمص",
        "بيضان",
        "ثدي",
        "بز",
        "بزاز",
        "حلمة",
        "مفلقسة",
        "بظر",
        "كس",
        "فرج",
        "شهوة",
        "شاذ",
        "مبادل",
        "عاهرة",
        "جماع",
        "قضيب",
        "زب",
        "لوطي",
        "لواط",
        "سحاق",
        "سحاقية",
        "اغتصاب",
        "خنثي",
        "احتلام",
        "نيك",
        "متناك",
        "متناكة",
        "شرموطة",
        "عرص",
        "خول",
        "قحبة",
        "لبوة",
        "amk",
        "amcığa",
        "amcığı",
        "amcığın",
        "amcık",
        "amcıklar",
        "amcıklara",
        "amcıklarda",
        "amcıklardan",
        "amcıkları",
        "amcıkların",
        "amcıkta",
        "amcıktan",
        "amı",
        "amlar",
        "çingene",
        "Çingenede",
        "Çingeneden",
        "Çingeneler",
        "Çingenelerde",
        "Çingenelerden",
        "Çingenelere",
        "Çingeneleri",
        "Çingenelerin",
        "Çingenenin",
        "Çingeneye",
        "Çingeneyi",
        "göt",
        "göte",
        "götler",
        "götlerde",
        "götlerden",
        "götlere",
        "götleri",
        "götlerin",
        "götte",
        "götten",
        "götü",
        "götün",
        "götveren",
        "götverende",
        "götverenden",
        "götverene",
        "götvereni",
        "götverenin",
        "götverenler",
        "götverenlerde",
        "götverenlerden",
        "götverenlere",
        "götverenleri",
        "götverenlerin",
        "kaltağa",
        "kaltağı",
        "kaltağın",
        "kaltak",
        "kaltaklar",
        "kaltaklara",
        "kaltaklarda",
        "kaltaklardan",
        "kaltakları",
        "kaltakların",
        "kaltakta",
        "kaltaktan",
        "orospu",
        "orospuda",
        "orospudan",
        "orospular",
        "orospulara",
        "orospularda",
        "orospulardan",
        "orospuları",
        "orospuların",
        "orospunun",
        "orospuya",
        "orospuyu",
        "otuz birci",
        "otuz bircide",
        "otuz birciden",
        "otuz birciler",
        "otuz bircilerde",
        "otuz bircilerden",
        "otuz bircilere",
        "otuz bircileri",
        "otuz bircilerin",
        "otuz bircinin",
        "otuz birciye",
        "otuz birciyi",
        "saksocu",
        "saksocuda",
        "saksocudan",
        "saksocular",
        "saksoculara",
        "saksocularda",
        "saksoculardan",
        "saksocuları",
        "saksocuların",
        "saksocunun",
        "saksocuya",
        "saksocuyu",
        "sıçmak",
        "sik",
        "sike",
        "siker sikmez",
        "siki",
        "sikilir sikilmez",
        "sikin",
        "sikler",
        "siklerde",
        "siklerden",
        "siklere",
        "sikleri",
        "siklerin",
        "sikmek",
        "sikmemek",
        "sikte",
        "sikten",
        "siktir",
        "siktirir siktirmez",
        "taşağa",
        "taşağı",
        "taşağın",
        "taşak",
        "taşaklar",
        "taşaklara",
        "taşaklarda",
        "taşaklardan",
        "taşakları",
        "taşakların",
        "taşakta",
        "taşaktan",
        "yarağa",
        "yarağı",
        "yarağın",
        "yarak",
        "yaraklar",
        "yaraklara",
        "yaraklarda",
        "yaraklardan",
        "yarakları",
        "yarakların",
        "yarakta",
        "yaraktan",

        "2g1c",
        "2 girls 1 cup",
        "acrotomophilia",
        "alabama hot pocket",
        "alaskan pipeline",
        "anal",
        "anilingus",
        "anus",
        "apeshit",
        "arsehole",
        "ass",
        "asshole",
        "assmunch",
        "auto erotic",
        "autoerotic",
        "babeland",
        "baby batter",
        "baby juice",
        "ball gag",
        "ball gravy",
        "ball kicking",
        "ball licking",
        "ball sack",
        "ball sucking",
        "bangbros",
        "bangbus",
        "bareback",
        "barely legal",
        "barenaked",
        "bastard",
        "bastardo",
        "bastinado",
        "bbw",
        "bdsm",
        "beaner",
        "beaners",
        "beaver cleaver",
        "beaver lips",
        "beastiality",
        "bestiality",
        "big black",
        "big breasts",
        "big knockers",
        "big tits",
        "bimbos",
        "birdlock",
        "bitch",
        "bitches",
        "black cock",
        "blonde action",
        "blonde on blonde action",
        "blowjob",
        "blow job",
        "blow your load",
        "blue waffle",
        "blumpkin",
        "bollocks",
        "bondage",
        "boner",
        "boob",
        "boobs",
        "booty call",
        "brown showers",
        "brunette action",
        "bukkake",
        "bulldyke",
        "bullet vibe",
        "bullshit",
        "bung hole",
        "bunghole",
        "busty",
        "butt",
        "buttcheeks",
        "butthole",
        "camel toe",
        "camgirl",
        "camslut",
        "camwhore",
        "carpet muncher",
        "carpetmuncher",
        "chocolate rosebuds",
        "cialis",
        "circlejerk",
        "cleveland steamer",
        "clit",
        "clitoris",
        "clover clamps",
        "clusterfuck",
        "cock",
        "cocks",
        "coprolagnia",
        "coprophilia",
        "cornhole",
        "coon",
        "coons",
        "creampie",
        "cum",
        "cumming",
        "cumshot",
        "cumshots",
        "cunnilingus",
        "cunt",
        "darkie",
        "date rape",
        "daterape",
        "deep throat",
        "deepthroat",
        "dendrophilia",
        "dick",
        "dildo",
        "dingleberry",
        "dingleberries",
        "dirty pillows",
        "dirty sanchez",
        "doggie style",
        "doggiestyle",
        "doggy style",
        "doggystyle",
        "dog style",
        "dolcett",
        "domination",
        "dominatrix",
        "dommes",
        "donkey punch",
        "double dong",
        "double penetration",
        "dp action",
        "dry hump",
        "dvda",
        "eat my ass",
        "ecchi",
        "ejaculation",
        "erotic",
        "erotism",
        "escort",
        "eunuch",
        "fag",
        "faggot",
        "fecal",
        "felch",
        "fellatio",
        "feltch",
        "female squirting",
        "femdom",
        "figging",
        "fingerbang",
        "fingering",
        "fisting",
        "foot fetish",
        "footjob",
        "frotting",
        "fuck",
        "fuck buttons",
        "fuckin",
        "fucking",
        "fucktards",
        "fudge packer",
        "fudgepacker",
        "futanari",
        "gangbang",
        "gang bang",
        "gay sex",
        "genitals",
        "giant cock",
        "girl on",
        "girl on top",
        "girls gone wild",
        "goatcx",
        "goatse",
        "god damn",
        "gokkun",
        "golden shower",
        "goodpoop",
        "goo girl",
        "goregasm",
        "grope",
        "group sex",
        "g-spot",
        "guro",
        "hand job",
        "handjob",
        "hard core",
        "hardcore",
        "hentai",
        "homoerotic",
        "honkey",
        "hooker",
        "horny",
        "hot carl",
        "hot chick",
        "how to kill",
        "how to murder",
        "huge fat",
        "humping",
        "incest",
        "intercourse",
        "jack off",
        "jail bait",
        "jailbait",
        "jelly donut",
        "jerk off",
        "jigaboo",
        "jiggaboo",
        "jiggerboo",
        "jizz",
        "juggs",
        "kike",
        "kinbaku",
        "kinkster",
        "kinky",
        "knobbing",
        "leather restraint",
        "leather straight jacket",
        "lemon party",
        "livesex",
        "lolita",
        "lovemaking",
        "make me come",
        "male squirting",
        "masturbate",
        "masturbating",
        "masturbation",
        "menage a trois",
        "milf",
        "missionary position",
        "mong",
        "motherfucker",
        "mound of venus",
        "mr hands",
        "muff diver",
        "muffdiving",
        "nambla",
        "nawashi",
        "negro",
        "neonazi",
        "nigga",
        "nigger",
        "nig nog",
        "nimphomania",
        "nipple",
        "nipples",
        "nsfw",
        "nsfw images",
        "nude",
        "nudity",
        "nutten",
        "nympho",
        "nymphomania",
        "octopussy",
        "omorashi",
        "one cup two girls",
        "one guy one jar",
        "orgasm",
        "orgy",
        "paedophile",
        "paki",
        "panties",
        "panty",
        "pedobear",
        "pedophile",
        "pegging",
        "penis",
        "phone sex",
        "piece of shit",
        "pikey",
        "pissing",
        "piss pig",
        "pisspig",
        "playboy",
        "pleasure chest",
        "pole smoker",
        "ponyplay",
        "poof",
        "poon",
        "poontang",
        "punany",
        "poop chute",
        "poopchute",
        "porn",
        "porno",
        "pornography",
        "prince albert piercing",
        "pthc",
        "pubes",
        "pussy",
        "queaf",
        "queef",
        "quim",
        "raghead",
        "raging boner",
        "rape",
        "raping",
        "rapist",
        "rectum",
        "reverse cowgirl",
        "rimjob",
        "rimming",
        "rosy palm",
        "rosy palm and her 5 sisters",
        "rusty trombone",
        "sadism",
        "santorum",
        "scat",
        "schlong",
        "scissoring",
        "semen",
        "sex",
        "sexcam",
        "sexo",
        "sexy",
        "sexual",
        "sexually",
        "sexuality",
        "shaved beaver",
        "shaved pussy",
        "shemale",
        "shibari",
        "shit",
        "shitblimp",
        "shitty",
        "shota",
        "shrimping",
        "skeet",
        "slanteye",
        "slut",
        "s&m",
        "smut",
        "snatch",
        "snowballing",
        "sodomize",
        "sodomy",
        "spastic",
        "spic",
        "splooge",
        "splooge moose",
        "spooge",
        "spread legs",
        "spunk",
        "strap on",
        "strapon",
        "strappado",
        "strip club",
        "style doggy",
        "suck",
        "sucks",
        "suicide girls",
        "sultry women",
        "swastika",
        "swinger",
        "tainted love",
        "taste my",
        "tea bagging",
        "threesome",
        "throating",
        "thumbzilla",
        "tied up",
        "tight white",
        "tit",
        "tits",
        "titties",
        "titty",
        "tongue in a",
        "topless",
        "tosser",
        "towelhead",
        "tranny",
        "tribadism",
        "tub girl",
        "tubgirl",
        "tushy",
        "twat",
        "twink",
        "twinkie",
        "two girls one cup",
        "undressing",
        "upskirt",
        "urethra play",
        "urophilia",
        "vagina",
        "venus mound",
        "viagra",
        "vibrator",
        "violet wand",
        "vorarephilia",
        "voyeur",
        "voyeurweb",
        "voyuer",
        "vulva",
        "wank",
        "wetback",
        "wet dream",
        "white power",
        "whore",
        "worldsex",
        "wrapping men",
        "wrinkled starfish",
        "xx",
        "xxx",
        "yaoi",
        "yellow showers",
        "yiffy",
        "zoophilia",
        "🖕"
    ]

    // Regex for general username validation (e.g., no special characters other than underscore/hyphen, not starting/ending with them)
    const usernameRegex = /^[a-zA-Z0-9_\-]+$/; // Allows alphanumeric, underscore, hyphen
    const startsEndsWithHyphenUnderscore = /^[_-]|[_-]$/;

    function showError(element, condition, message = "!") {
        element.textContent = message;
        element.style.display = condition ? "inline" : "none";
    }

    function validateUsername(username) {
        const lowerCaseUsername = username.toLowerCase();
        for (const blocked of blockedUsernames) {
            if (lowerCaseUsername.includes(blocked)) {
                return "Username contains a blocked word.";
            }
        }
        if (!usernameRegex.test(username)) {
            return "Username can only contain letters, numbers, underscores, and hyphens.";
        }
        if (startsEndsWithHyphenUnderscore.test(username)) {
            return "Username cannot start or end with an underscore or hyphen.";
        }
        if (username.length < 3 || username.length > 20) {
            return "Username must be 3-20 characters.";
        }
        return null; // No error
    }

    function validateForm() {
        let isValid = true;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const usernameValidationError = validateUsername(name);
        if (usernameValidationError) {
            showError(nameError, true, usernameValidationError);
            isValid = false;
        } else {
            showError(nameError, false);
        }

        showError(emailError, email === "", "Email is required.");
        if (email === "") isValid = false;
        // Basic email format check (can be more robust)
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError(emailError, true, "Invalid email format.");
            isValid = false;
        } else {
            showError(emailError, false);
        }


        showError(passwordError, password.length < 8, "Password must be at least 8 characters.");
        if (password.length < 8) isValid = false;

        showError(confirmPasswordError, confirmPassword !== password, "Passwords do not match.");
        if (confirmPassword !== password) isValid = false;

        showError(termsError, !termsCheckbox.checked, "You must agree to the terms.");
        if (!termsCheckbox.checked) isValid = false;

        registerButton.disabled = !isValid;
        return isValid;
    }

    // Listen for input changes
    [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(input =>
        input.addEventListener("input", validateForm)
    );
    termsCheckbox.addEventListener("change", validateForm);

    // Handle form submission
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) {
            alert("Please correct the errors in the form.");
            return;
        }

        const fullName = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                const user = userCredential.user;
                return user.updateProfile({
                    displayName: fullName
                }).then(() => {
                    const userRefRTDB = db.ref("users/" + user.uid);
                    const dbFirestore = firebase.firestore();
                    const userDocRefFirestore = dbFirestore.collection("users").doc(user.uid);

                    const userData = {
                        fullName: fullName,
                        displayName: fullName,
                        email: user.email,
                        uid: user.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    };

                    const rtdbPromise = userRefRTDB.set(userData); // For RTDB
                    const firestorePromise = userDocRefFirestore.set(userData, { merge: true }); // For Firestore
                    return Promise.all([rtdbPromise, firestorePromise]);
                });
            })
            .then(() => {
                alert("Account created successfully! You are now logged in.");
                window.location.href = "index.html"; // Redirect to main page after auto-login
            })
            .catch(error => {
                console.error("Error creating user:", error);
                if (error.code === "auth/email-already-in-use") {
                    alert("An account already exists with this email address. Please log in or use a different email.");
                } else if (error.code === "auth/invalid-email") {
                    alert("The email address is not valid. Please enter a valid email.");
                } else if (error.code === "auth/weak-password") {
                    alert("The password is too weak. Please choose a stronger password (at least 8 characters).");
                } else {
                    alert("Signup failed: " + error.message);
                }
            });
    });

    validateForm(); // Initial state
});

// Google Sign-In Callbacks
function onSuccess(googleUser) {
    const profile = googleUser.getBasicProfile();
    const googleFullName = profile.getName();
    const googleEmail = profile.getEmail();
    console.log("Google User Profile:", profile);

    const id_token = googleUser.getAuthResponse().id_token;
    const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

    auth.signInWithCredential(credential)
        .then((result) => {
            const user = result.user;
            console.log("Firebase Google sign-in successful for user:", user);

            let updateAuthProfilePromise = Promise.resolve();
            if (!user.displayName || user.displayName !== googleFullName) {
                updateAuthProfilePromise = user.updateProfile({
                    displayName: googleFullName
                });
            }

            return updateAuthProfilePromise.then(() => {
                const userRefRTDB = db.ref("users/" + user.uid);
                const dbFirestore = firebase.firestore();
                const userDocRefFirestore = dbFirestore.collection("users").doc(user.uid);

                const userData = {
                    fullName: googleFullName,
                    displayName: googleFullName,
                    email: user.email,
                    uid: user.uid,
                    photoURL: user.photoURL || profile.getImageUrl(),
                    provider: "google.com",
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                };

                const rtdbPromise = userRefRTDB.set(userData); // For RTDB
                const firestorePromise = userDocRefFirestore.set(userData, { merge: true }); // For Firestore
                return Promise.all([rtdbPromise, firestorePromise]);
            });
        })
        .then(() => {
            console.log("User profile updated in Firebase Auth and Database(s).");
            alert("Successfully signed in with Google!");
            window.location.href = "index.html"; // Redirect to main page
        })
        .catch(error => {
            console.error("Firebase Google sign-in or profile update error:", error);
            const currentUser = auth.currentUser;
            if (currentUser && currentUser.providerData.some(provider => provider.providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID)) {
                auth.signOut().then(() => {
                    var auth2 = gapi.auth2.getAuthInstance();
                    if (auth2) {
                        auth2.disconnect();
                    }
                });
            }
            alert("Google sign-in failed: " + error.message + ". Please try again.");
        });
}

function onFailure(error) {
    console.error("Google sign-in API error:", error);
    alert("Google sign-in failed. Error: " + JSON.stringify(error, undefined, 2));
}

function renderButton() {
    if (typeof gapi !== 'undefined' && gapi.signin2) {
        gapi.signin2.render('my-signin2', {
            scope: 'profile email',
            width: 240,
            height: 50,
            longtitle: true,
            theme: 'dark',
            onsuccess: onSuccess,
            onfailure: onFailure
        });
    } else {
        console.error("Google API not loaded, cannot render sign-in button.");
        setTimeout(renderButton, 1000);
    }
}

if (typeof gapi !== 'undefined') {
    gapi.load('auth2', function () {
        if (!gapi.auth2.getAuthInstance()) {
            gapi.auth2.init({
                client_id: '469147461208-t8qvufef54kiq7jch2v390db28v3ebck.apps.googleusercontent.com'
            }).then(renderButton, onFailure);
        } else {
            renderButton();
        }
    });
} else {
    console.warn("Google Platform Library (platform.js) might not be loaded yet.");
}


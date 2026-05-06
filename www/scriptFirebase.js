const firebaseConfig = {
    apiKey: "AIzaSyDT0HQQt9SpTf_8_BGbWV0cJU4JQwuKZW4",
    authDomain: "game-tu-tien.firebaseapp.com",
    projectId: "game-tu-tien",
    storageBucket: "game-tu-tien.firebasestorage.app",
    messagingSenderId: "21599857194",
    appId: "1:21599857194:web:470f468938ab534defb153"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

const isHtmlPage = window.location.pathname.replace(/\\/g, '/').includes('/html/');
const pageRoutes = {
    login: isHtmlPage ? "../index.html" : "index.html",
    register: isHtmlPage ? "register.html" : "html/register.html",
    createCharacter: isHtmlPage ? "create-character.html" : "html/create-character.html",
    game: isHtmlPage ? "game.html" : "html/game.html"
};

auth.onAuthStateChanged((user) => {
    const path = window.location.pathname;
    const isGamePage = path.includes('game.html');
    const isCreatePage = path.includes('create-character.html');

    if (!user && (isGamePage || isCreatePage)) {
        window.location.href = pageRoutes.login;
        return;
    }

    if (user && isGamePage && typeof defaultPlayer !== "undefined") {
        db.collection("players").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                player = typeof normalizePlayer === "function"
                    ? normalizePlayer(doc.data())
                    : { ...defaultPlayer, ...doc.data() };
                localStorage.setItem('tutien_v4_scale', JSON.stringify(player));
                updateUI();
            }
        });
    }
});

function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const isRobot = document.getElementById('not-robot').checked;

    if (!isRobot) return alert("Vui long xac thuc Tien Can!");
    if (!username.includes('@')) return alert("Vui long nhap Email chinh xac!");

    auth.signInWithEmailAndPassword(username, pass)
        .then((userCredential) => checkUserCharacter(userCredential.user.uid))
        .catch(() => alert("Sai danh tinh hoac mat ma!"));
}

function handleRegister() {
    const email = document.getElementById('reg-email').value.trim();
    const pass = document.getElementById('reg-password').value;
    const rePass = document.getElementById('reg-repassword').value;
    const isRobot = document.getElementById('reg-not-robot').checked;

    if (!isRobot) return alert("Vui long xac thuc Tien Can!");
    if (!email || !pass || !rePass) return alert("Cac truong thong tin khong duoc de trong!");
    if (!email.includes('@')) return alert("Email khong hop le!");
    if (pass !== rePass) return alert("Mat ma xac nhan khong trung khop!");

    auth.createUserWithEmailAndPassword(email, pass)
        .then(() => {
            alert("Dang ky thanh cong. Hay tao nhan vat!");
            window.location.href = pageRoutes.createCharacter;
        })
        .catch((error) => alert("Loi dang ky: " + error.message));
}

function checkUserCharacter(uid) {
    db.collection("players").doc(uid).get().then((doc) => {
        if (doc.exists) {
            localStorage.setItem('tutien_v4_scale', JSON.stringify(doc.data()));
            localStorage.setItem('hasCharacter', 'true');
            window.location.href = pageRoutes.game;
            return;
        }

        localStorage.removeItem('hasCharacter');
        window.location.href = pageRoutes.createCharacter;
    });
}

function handleCreateCharacter() {
    const name = document.getElementById('char-name').value.trim();
    if (!name) return alert("Dao huu chua dat ten!");

    const basePlayer = typeof defaultPlayer !== "undefined"
        ? JSON.parse(JSON.stringify(defaultPlayer))
        : {};

    player = typeof normalizePlayer === "function"
        ? normalizePlayer({ ...basePlayer, name })
        : { ...basePlayer, name };

    localStorage.setItem('hasCharacter', 'true');
    saveGame(false);
    window.location.href = pageRoutes.game;
}

function saveGame(isManual = false) {
    const user = auth.currentUser;
    localStorage.setItem('tutien_v4_scale', JSON.stringify(player));

    if (user) {
        db.collection("players").doc(user.uid).set(player)
            .then(() => {
                if (isManual && typeof addLog === "function") {
                    addLog("Than thuc da duoc luu giu tren Tien Bang.", "system", "log-gain");
                }
            })
            .catch(err => console.error("Loi dong bo may:", err));
    }
}

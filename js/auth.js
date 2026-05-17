import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "./firebase.js";

// LOGIN
window.login = async function () {

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Login efetuado com sucesso!");

        window.location.href = "admin.html";

    } catch (error) {

        alert(error.message);

    }

}

// REGISTO
window.register = async function () {

    const email =
    document.getElementById("registerEmail").value;

    const password =
    document.getElementById("registerPassword").value;

    try {

        await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        alert("Conta criada com sucesso!");

        window.location.href = "login.html";

    } catch (error) {

        alert(error.message);

    }

}

// LOGOUT
window.logout = async function () {

    await signOut(auth);

    window.location.href = "login.html";

}
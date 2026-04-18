function auth() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost/budget-app/backend/login.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("LOGIN RESPONSE:", data);

        if (data.status === "success") {
            localStorage.setItem("user_id", data.user_id);
            window.location.href = "home.html";
        } else {
            alert(data.message || "Login failed");
        }
    })
    .catch(err => {
        console.error("FETCH ERROR:", err);
        alert("Request failed");
    });

    return false;
}


function signup() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost/budget-app/backend/signup.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        console.log("SIGNUP RESPONSE:", data);

        if (data.status === "success") {
            alert("Signup successful");
            window.location.href = "login.html";
        } else {
            alert(data.message || "Signup failed");
        }
    })
    .catch(err => {
        console.error("FETCH ERROR:", err);
        alert("Request failed");
    });

    return false;
}
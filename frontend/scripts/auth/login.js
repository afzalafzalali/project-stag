const signUpForm = document.getElementById("login-form");

async function login({ name, email, password }) {
  try {
    const emailErrElem = document.getElementById("email-error");
    const passwordErrElem = document.getElementById("password-error");

    emailErrElem.innerHTML = "";
    passwordErrElem.innerHTML = "";

    const loader = document.getElementById("submit-bnt-loader");
    const submitBtnText = document.getElementById("submit-bnt-text");

    loader.classList.remove("hidden");
    submitBtnText.classList.add("hidden");
    const response = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    loader.classList.add("hidden");
    submitBtnText.classList.remove("hidden");
    //
    if (data.success) {
      localStorage.setItem("user-auth-token", `Bearer ${data.token}`);
      location.href = "http://localhost:8000";
    } else {
      emailErrElem.innerHTML = data.errors["email"]
        ? data.errors["email"]["_errors"][0]
        : "";
      passwordErrElem.innerHTML = data.errors["password"]
        ? data.errors["password"]["_errors"][0]
        : "";
    }

    return data;
  } catch (error) {
    console.log("error message", error.message);
  }
}
//

// input element
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const data = await login({ email, password });
});
// handling password show and hide functionality
const showPasswordBtn = document.getElementById("show-password-btn");
const hidePasswordBtn = document.getElementById("hide-password-btn");
//
showPasswordBtn.addEventListener("click", () => {
  passwordInput.type = "text";
  //
  showPasswordBtn.classList.add("hidden");
  //
  hidePasswordBtn.classList.remove("hidden");
});
//
hidePasswordBtn.addEventListener("click", () => {
  passwordInput.type = "password";
  //
  hidePasswordBtn.classList.add("hidden");
  //
  showPasswordBtn.classList.remove("hidden");
});

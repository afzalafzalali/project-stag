const signUpForm = document.getElementById("signup-form");

async function signup({ name, email, password }) {
  const nameErrElem = document.getElementById("name-error");
  const emailErrElem = document.getElementById("email-error");
  const passwordErrElem = document.getElementById("password-error");
  // reseting errors on signup
  nameErrElem.innerHTML = "";
  emailErrElem.innerHTML = "";
  passwordErrElem.innerHTML = "";
  try {
    const loader = document.getElementById("submit-bnt-loader");
    const submitBtnText = document.getElementById("submit-bnt-text");

    loader.classList.remove("hidden");
    submitBtnText.classList.add("hidden");
    const response = await fetch("http://localhost:3000/api/user/signup", {
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
        ? data.errors["email"]["_errors"][0] || data.errors["email"]
        : "";
      nameErrElem.innerHTML = data.errors["name"]
        ? data.errors["name"]["_errors"][0] || data.errors["name"]
        : "";
      passwordErrElem.innerHTML = data.errors["password"]
        ? data.errors["password"]["_errors"][0] || data.errors["password"]
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
const nameInput = document.getElementById("name");
signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const name = nameInput.value;

  const data = await signup({ name, email, password });
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

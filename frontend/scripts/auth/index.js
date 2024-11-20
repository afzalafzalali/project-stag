const signUpForm = document.getElementById("signup-form");

async function signup({ name, email, password }) {
  try {
    const response = await fetch("http://localhost:3000/api/user/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem("user-auth-token", `Bearer ${data.token}`);
      location.href = "http://localhost:8000"
    }
    return data;
  } catch (error) {
    console.log("error message", error.message);
  }
}
//
async function login({ email, password }) {
  try {
    const data = (
      await axios.post("http://localhost:3000/api/user/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      })
    ).data;

    if (data.success) {
      localStorage.setItem("user-auth-token", `Bearer ${data.token}`);
    }

    return data;
  } catch (error) {
    console.log("signup error", error.message);
  }
}
//
async function checkForLogedInUser() {
  const userAuthToken = localStorage.getItem("user-auth-token");
  if (!userAuthToken) return null;
  const response = fetch("http://localhost:3000/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${userAuthToken}`,
    },
  });
  const userData = await response.json();
  return userData;
}

// input element
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

signUpForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  // error element
  const nameErrElem = document.getElementById("name-error");
  const emailErrElem = document.getElementById("email-error");
  const passwordErrElem = document.getElementById("password-error");
  //   resetting errors
  nameErrElem.innerHTML = "";
  emailErrElem.innerHTML = "";
  passwordErrElem.innerHTML = "";
  //   setting input errors

  const name = document.getElementById("name").value;
  const email = emailInput.value;
  const password = passwordInput.value;
  //
  switch (true) {
    case !name:
      nameErrElem.innerHTML = "name should be provided";

    case !email:
      emailErrElem.innerHTML = "Email should be provided";

    case !password:
      passwordErrElem.innerHTML = "Password should be provided";
  }

  // return if any of the required input is not provided
  if (!name || !email || !password) return;

  const data = await signup({ name, email, password });

  if (!data.success) {
  }
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

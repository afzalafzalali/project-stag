//

async function checkForLogedInUser() {
  try {
    const logoutBtn = document.getElementById("logout-btn");
    const userNameElem = document.getElementById("user-info-name");
    const navSigninBtn = document.getElementById("nav-signin-btn");
    const userAuthToken = localStorage.getItem("user-auth-token");

    console.log("token: ", userAuthToken);
    if (!userAuthToken) return;

    const response = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      headers: {
        Authorization: userAuthToken,
      },
    });
    const data = await response.json();

    console.log("data:", data);
    if (data.success) {
      userNameElem.classList.remove("hidden");
      logoutBtn.classList.remove("hidden");
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("user-auth-token");
        window.location.reload();
      });
      userNameElem.innerHTML = `Hi ${data.user.name}`;
      navSigninBtn.classList.add("hidden");
      return;
    }
    //
    userNameElem.classList.add("hidden");
    logoutBtn.classList.add("hidden");
    navSigninBtn.classList.remove("hidden");

    //
  } catch (error) {
    console.log(error);
  }
}

checkForLogedInUser();

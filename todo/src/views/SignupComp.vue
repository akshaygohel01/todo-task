<template>
  <div>
    <h1>Signup Page</h1>
    <form @submit="checkSubmit">
      <div class="fields">
        <label for="fname">Full Name:</label>
        <input type="text" id="fname" v-model="fname" />
        <p v-if="showName">{{ warnName }}</p>
      </div>
      <div class="fields">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" />
        <p v-if="showEmail">{{ warnEmail }}</p>
      </div>
      <div class="fields">
        <label for="password">Password:</label>
        <input type="text" id="password" v-model="password" />
        <p v-if="showPassword">{{ warnPassword }}</p>
      </div>
      <div class="fields">
        <label for="mobile">Mobile:</label>
        <input type="number" id="mobile" v-model="mobile" />
        <p v-if="showMobile">{{ warnMobile }}</p>
      </div>

      <button type="submit" class="submit">Signup</button>
      <div class="new">
        Already have an account?
        <RouterLink to="/login"
          ><button class="login">Login Here</button></RouterLink
        >
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";
import router from "@/router";

let fname = ref("");
let email = ref("");
let password = ref("");
let mobile = ref("");

let warnName = ref("");
let warnEmail = ref("");
let warnPassword = ref("");
let warnMobile = ref("");

let showName = ref(false);
let showEmail = ref(false);
let showPassword = ref(false);
let showMobile = ref(false);

//Name Validation:
function validateName() {
  if (fname.value.trim() === "") {
    showName.value = true;
    warnName.value = "name can't be empty.";
  } else {
    showName.value = false;
  }
}

watch(fname, () => {
  if (fname.value !== "") {
    showName.value = false;
  }

  fname.value = fname.value.replace(/\d+/g,"");
  validateName();
});

//Email Validation:
let emailPattern = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
function validateEmail() {
  if (email.value.trim() === "") {
    showEmail.value = true;
    warnEmail.value = "Email Can't be Empty.";
  } else if (!email.value.match(emailPattern)) {
    showEmail.value = true;
    warnEmail.value = "Email is invalid (Ex. format - abc@xyz.com)";
  } else {
    showEmail.value = false;
  }
}

watch(email, () => {
  if (email.value.trim() !== "") {
    showEmail.value = false;
  }
  validateEmail();
});

//Password Validation:
function validatePassword() {
  if (password.value.trim() === "") {
    showPassword.value = true;
    warnPassword.value = "Password Can't be Empty";
  } else if (password.value.length < 8) {
    showPassword.value = true;
    warnPassword.value = "Password must be of 8 digits or more than that";
  } else {
    showPassword.value = false;
  }
}

watch(password, () => {
  if (password.value.trim() !== "") {
    showPassword.value = false;
  }
  validatePassword();
});

//Mobile Validation:
function validateMobile() {
  if (String(mobile.value).length === 0) {
    showMobile.value = true;
    warnMobile.value = "Mobile number can't be empty";
  } else if (String(mobile.value).length !== 10) {
    showMobile.value = true;
    warnMobile.value = "Mobile number must be of 10 digits.";
  } else {
    showMobile.value = false;
  }
}

watch(mobile, () => {
  if (String(mobile.value).length === 10) {
    showMobile.value = false;
  }

  validateMobile();
});

function checkSubmit(e) {

  e.preventDefault();
  validateName();
  validateEmail();
  validatePassword();
  validateMobile();

  if ( showName.value || showEmail.value || showMobile.value || showPassword.value ) {
    return;
  }

  const data = {
    fullName: fname.value,
    email: email.value,
    password: password.value,
    mobile_no: mobile.value,
    tasks: []
  };

  axios
    .post("http://localhost:3000/users", data)
    .then((response) => {
      console.log("User signed up successfully!");
      console.log("New User data: ", response.data);
      router.push('/login');
    })
    .catch((error) => {
      console.error("Failed to sign up user:", error.message);
    });
}
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.fields {
  margin-top: 20px;
}

input {
  width: 25%;
  padding-top: 8px;
  padding-bottom: 8px;
}

.submit {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #363f43;
  color: white;
}

.new {
  margin-top: 20px;
}

.login {
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #1c70a8;
  color: white;
}

label {
  margin-right: 8px;
  font-weight: 500;
}

p {
  padding-left: 70px;
  color: red;
}
</style>
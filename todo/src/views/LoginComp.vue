<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="checkLogin">
      <div class="fields">
        <label for="email">Email Id:</label>
        <input type="email" id="email" v-model="email" />
        <p v-if="showEmail">{{warnEmail}}</p>
      </div>
      <div class="fields">
        <label for="password">Password:</label>
        <input type="text" id="password" v-model="password" />
        <p v-if="showPassword">{{ warnPassword }}</p>
      </div>
      <button type="submit" class="submit">Login</button>
      <div class="new">
        Don't have an account?
        <RouterLink to="/"><button class="signup">Signup Here</button></RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import router from "@/router";
import axios from "axios";
import {ref, watch} from 'vue';
import { RouterLink } from "vue-router";
import {useTodoStore} from "../store/todoStore";

const todoStore = useTodoStore();


let email = ref('');
let password = ref('');

let showEmail = ref(false);
let showPassword = ref(false);

let warnEmail = ref('');
let warnPassword = ref('');


const getdata = async() => {
  try {
    const response = await axios.get("http://localhost:3000/users");
    const users = response.data;
    const user = users.find(user => user.email === email.value && user.password === password.value);
    // console.log(user);
    if (user) {
      localStorage.setItem('isValid', true);
      todoStore.currentUser(user);
      todoStore.currentUserId(user.id);
      alert('Login successful');
      router.push('/first');
    } else {
      alert('Invalid email or password');
    }

  } catch (error) {
    alert("Error fetching users:", error.message);
  }
}

function checkLogin() {

  //Email Validation
  if(email.value.trim() === ""){
    showEmail.value = true;
    warnEmail.value = 'Email field must be filled';
  } else{
    showEmail.value = false;
  }

  watch(email,() => {
    if(email.value){
      showEmail.value = false;
    }
  })

  //Password validation
  if(password.value.trim() === ""){
    showPassword.value = true;
    warnPassword.value = 'Password field must be filled';
  }else{
    showPassword.value = false;
  }

  watch(password,() => {
    if(password.value){
      showPassword.value = false;
    }
  })

  getdata();
}

</script>

<style scoped>
.fields {
  margin-top: 20px;
}

label {
  margin-right: 8px;
  font-weight: 500;
}

input {
  width: 25%;
  padding-top: 8px;
  padding-bottom: 8px;
}

p {
  padding-left: 70px;
  color: red;
}

.submit {
  margin-top: 20px;
  margin-left: 57px;
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #1c70a8;
  color: white;
}

.signup {
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #363f43;
  color: white;
}
</style>
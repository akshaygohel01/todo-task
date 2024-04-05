<template>
  <div>
    <RouterLink to="/first">Home</RouterLink>
    <RouterLink to="/todo">Add Task</RouterLink>
    <RouterLink to="/display-task">Display-Tasks</RouterLink>

    <button @click="logout" class="logout">Logout</button>
    <RouterView />
    <h1>Hello from the Home Component.</h1>
  </div>
</template>

<script setup>
import router from "@/router";
import { RouterLink, RouterView } from "vue-router";

function logout() {
  localStorage.setItem("isValid", false);
  router.push("/login");
}
</script>

<style scoped>
.logout {
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #1c70a8;
  color: white;
}
a:-webkit-any-link {
  margin: 20px;
  text-decoration: none;
  background: #576774;
  padding: 10px 20px;
  border: 2px solid rgb(79, 73, 73);
  border-radius: 10px;
  color: white;
}

a.router-link-active.router-link-exact-active {
    color: #ff1616;
    font-weight: 700;
}
</style>
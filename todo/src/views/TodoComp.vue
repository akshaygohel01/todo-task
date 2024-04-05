<template>
  <div>
    <RouterLink to="/first">Home</RouterLink>
    <RouterLink to="/todo">Add Task</RouterLink>
    <RouterLink to="/display-task">Display-Tasks</RouterLink>

    <button @click="logout" class="logout">Logout</button>
    <RouterView />

    <form @submit="checkSubmit">
      <h1>Todo List</h1>
      <div class="fields">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model.trim="taskTitle" />
      </div>
      <div class="fields">
        <label for="desc">Description:</label>
        <input type="text" id="desc" v-model.trim="taskDescription" />
      </div>
      <div class="fields" v-if="showStatusField">
        <label for="status">Status:</label>
        <select id="status" v-model="taskStatus">
          <option value="pending" selected>Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <button type="submit" class="todo-btn" v-if="!abc">Add Item</button>
      <button type="submit" @click="editData" class="todo-btn" v-else>
        Change Item
      </button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { RouterLink } from "vue-router";
import { useTodoStore } from "@/store/todoStore";
import router from "@/router";

function logout() {
  localStorage.setItem("isValid", false);
  router.push("/login");
}

const todoStore = useTodoStore();

const taskTitle = ref("");
const taskDescription = ref("");
const taskStatus = ref("pending");
const showStatusField = ref(false);

let taskInfo = computed(() => {
  return todoStore.getEditedData();
});

console.log("taskInfo................", taskInfo.value);

onMounted(async () => {
  await todoStore.getData();
  addData();
});

// onUnmounted(()=> {
//   taskInfo.value = {};
// })

const abc = ref(JSON.parse(localStorage.getItem("showBtn")));

//getting pre-filled data for editing task.
let taskid = ref();
const addData = async () => {
  if (taskInfo.value) {
    taskTitle.value = taskInfo.value?.title ? taskInfo.value?.title : ""; //if no value found then make empty ' '
    taskDescription.value = taskInfo.value?.description
      ? taskInfo.value?.description
      : "";
    taskid.value = taskInfo.value?.taskId ? taskInfo.value?.taskId : "";
    taskStatus.value = taskInfo.value?.status
      ? taskInfo.value?.status
      : "pending";
    showStatusField.value = true;
  } else {
    showStatusField.value = false;
  }
};


const tempArray = [];
let data = ref();
const editData = () => {

  if (
    taskTitle.value.trim() === '' ||
    taskDescription.value.trim() === ''
  ) {
    alert("All the fields must be filled.");
    return;
  }

  let obj = {
    title: taskTitle.value,
    description: taskDescription.value,
    status: taskStatus.value,
    taskId: taskid.value,
  };

  data.value = todoStore.getTask();

  // console.log(obj);

  data.value.find((x) => {
    //If taskid matches then add updated data in array
    if (x.taskId === taskid.value) {
      tempArray.push(obj);
    }

    //add old tasks data in array, incase taskid won't match.
    if (x.taskId !== taskid.value) {
      tempArray.push(x);
    }
  });
  todoStore.updatedTask(tempArray);
  todoStore.resetUpdateTask();
  router.push({ name: "display" });

};

const checkSubmit = () => {
  let taskData = {
    title: taskTitle.value,
    description: taskDescription.value,
    status: taskStatus.value,
    taskId: Math.floor(Math.random() * 10000),
  };
  console.log(taskData, "taskData");

  if (
    taskData.title.trim() !== "" &&
    taskData.description.trim() !== "" &&
    taskData.status !== ""
  ) {
    todoStore.addTask(taskData);

    alert("Task Added Successfully.");
  } else {
    alert("All the field must be filled ...");
  }
};
</script>

<style scoped>
a.router-link-active.router-link-exact-active {
  color: #ff1616;
  font-weight: 700;
}
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

.todo-btn {
  margin-top: 20px;
  margin-left: 57px;
  padding: 12px 20px;
  border-radius: 11px;
  border: 1px solid black;
  background: #1c70a8;
  color: white;
}

.back-div {
  margin-top: 30px;
  margin-left: 48px;
}

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
</style>
<template>
  <div>
    <RouterLink to="/first">Home</RouterLink>
    <RouterLink to="/todo">Add Task</RouterLink>
    <RouterLink to="/display-task">Display-Tasks</RouterLink>

    <button @click="logout" class="logout">Logout</button>
    <RouterView />

    <template v-if="paginatedFilteredTasks.length > 0">
      <h1>Tasks Data</h1>
      <div class="filterDiv">
        <h3>Filter your data:</h3>
        <select v-model="selectedStatus" class="selectStatus" @change="applyFilter">
          <option value="" selected>All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">in-progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <table class="task-table">
        <thead>
          <tr>
            <th>Tasks.</th>
            <th>Task ID.</th>
            <th>Title</th>
            <th>Description</th>
            <th>Statuss</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in paginatedFilteredTasks" :key="index">
            <td>{{ (currentPage - 1) * taskPerPage + index + 1 }}</td>
            <td>{{ task.taskId }}</td>
            <td>{{ task.title }}</td>
            <td>{{ task.description }}</td>
            <td>{{ task.status }}</td>
            <td class="buttons">
              <button class="editBtn" @click="editBtn(task)">Edit</button>
              <button class="deleteBtn" @click="deleteData(task.taskId)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" class="prevBtn">Previous</button>
        <span>{{ currentPage }}</span>
        <button @click="nextPage" class="prevBtn" :disabled="isNextPageDisabled">Next</button>
      </div>
    </template>
    <template v-else>
  <h1 v-if="tasks.length === 0 || paginatedFilteredTasks.length === 0 ">No tasks found</h1>
  <template v-else>
    <h1>No tasks found on this page</h1>
  </template>
  <button v-if="currentPage > 1" @click="prevPage" class="prevBtn">Previous Page</button>
</template>
  </div>
</template>

<script setup>
import { useTodoStore } from "@/store/todoStore";
import { RouterLink } from "vue-router";
import router from "@/router";
import { onMounted, computed, ref } from "vue";

function logout() {
  localStorage.setItem("isValid", false);
  router.push("/login");
}

const selectedStatus = ref('');

const todoStore = useTodoStore();
const currentPage = computed(() => todoStore.currentPage);
const taskPerPage = 5;
const tasks = computed(() => todoStore.getTask());


const applyFilter = () => {
  todoStore.currentPage = 1;
}

// const paginatedTasks = computed(() => {
//   return todoStore.paginatedTasks;
// });

const nextPage = () => {
  todoStore.nextPage();
};

const prevPage = () => {
  todoStore.prevPage();
};

const isNextPageDisabled = computed(() => {
  const totalFilteredPages = Math.ceil(filteredTasks.value.length / taskPerPage);
  const totalUnfilteredPages = Math.ceil(tasks.value.length / taskPerPage);
  const totalPages = selectedStatus.value ? totalFilteredPages : totalUnfilteredPages;

  return currentPage.value >= totalPages || totalPages === 0;
});

const paginatedFilteredTasks = computed(() => {
  const status = selectedStatus.value;
  const tasksToPaginate = status ? filteredTasks.value : tasks.value;
  const startIndex = (currentPage.value - 1) * taskPerPage;
  const endIndex = startIndex + taskPerPage;
  return tasksToPaginate.slice(startIndex, endIndex);
});


const filteredTasks = computed(() => {
  const status = selectedStatus.value;
  if (!status) {
    return todoStore.paginatedTasks;
  } else {
    return todoStore.filterData(status);
  }
});

onMounted(async () => {
  await todoStore.getData();
  // getTasksInfo.value = todoStore.getTask();
});

const deleteData =  async(taskId) => {
  try{
    await todoStore.deleteTask(taskId);
    // getTasksInfo.value = todoStore.getTask();
    // todoStore.getData();
    todoStore.getTask().splice(todoStore.getTask().findIndex(task => task.taskId === taskId), 1);
  } catch(err) {
    console.log("error", err);
  }
};

const editBtn = (task) => {
  localStorage.setItem("showBtn", true);
  todoStore.editData(task);
  router.push({ name: "todo" });
};

router.beforeEach((to, from) => {
  if (from.name == "todo") {
    localStorage.setItem("showBtn", false);
  }
});
</script>

<style scoped>
a.router-link-active.router-link-exact-active {
  color: #ff1616;
  font-weight: 700;
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

.logout {
  padding: 10px 20px;
  border-radius: 17px;
  border: 1px solid black;
  background: #1c70a8;
  color: white;
}

table {
  margin: 0 auto;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  margin: 20px;
  text-align: center;
}

th {
  background-color: #ffa0a0;
}

.editBtn {
  margin: 10px 20px;
  padding: 8px 13px;
  background: #55edff;
  border: 1px solid black;
  border-radius: 5px;
}

.deleteBtn {
  padding: 8px 13px;
  background: #ed5959;
  border: 1px solid black;
  border-radius: 5px;
}

.buttons {
  border: none;
}

.pagination {
  margin-top: 50px;
}

.prevBtn {
  margin: 10px 10px;
  padding: 8px 13px;
  background: #9daaf9;
  border: 1px solid black;
  border-radius: 5px;
}

.filterDiv{
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 13px;
}

.filterBtn{
  padding: 0.4rem;
  border: 1px solid black;
  border-radius: 5px;
  background: #9daaf9;
}

.selectStatus{
  padding: 5px;
  text-align: center;
}
</style>
import axios from "axios";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useTodoStore = defineStore("todoList", () => {
  const updateTask = ref();
  const tasks = ref([]);
  const userId = ref("");
  const user = ref({});

  //pagination
  const currentPage = ref(1);
  const tasksPerPage = 5;

  const paginatedTasks = computed(() => {
    const startIndex = (currentPage.value - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    const slicedTask =  tasks.value.slice(startIndex, endIndex);
    console.log("paginated tasks: ", slicedTask);
    return slicedTask;
  });




  const nextPage = () => {
    const totalPages = Math.ceil(tasks.value.length / tasksPerPage);
    if (currentPage.value < totalPages) {
      currentPage.value++;
      console.log("Next Page:", currentPage.value);
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
      console.log("Next Page:", currentPage.value);
    }
  };


  const filterData = (value) => {
    return tasks.value.filter(x => x.status === value);
  }



  //Add Task:
  const addTask = (task) => {
    let userID = localStorage.getItem("tempId");
    let currentUser = user.value;
    if (currentUser && currentUser.id === userID) {
      currentUser.tasks.push(task);
      axios
        .put(`http://localhost:3000/users/${userID}`, currentUser)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => console.log(err));
    } else {
      console.error("User not found");
    }
  };

  const updatedTask = (task) => {
    let userID = localStorage.getItem("tempId");
    let currentUser = user.value;
    if (currentUser && currentUser.id === userID) {
      currentUser.tasks = task;
      axios
        .put(`http://localhost:3000/users/${userID}`, currentUser)
        .then((res) => {
          console.log("res", res);
        })
        .catch((err) => console.log(err));
    } else {
      console.error("User not found");
    }
  };

  const resetUpdateTask = () => {
    updateTask.value = null;
  };




  const getTask = () => {
    return tasks.value;
  };

  const currentUserId = (temp) => {
    userId.value = temp;
    localStorage.setItem("tempId", userId.value);
  };

  const getCurrentUserId = () => {
    return userId.value;
  };

  const currentUser = (temp) => {
    user.value = temp;
  };

  const getCurrentUser = () => {
    return user.value;
  };

  //Edit Task
  const editData = (data) => {
    updateTask.value = data;
  };

  const getEditedData = () => {
    return updateTask.value;
  };


  const getData = async () => {
    let userID = localStorage.getItem("tempId");
    await axios.get("http://localhost:3000/users").then((response) => {
      user.value = response.data.find((x) => x.id == userID);
      tasks.value = user.value.tasks;
      console.log(tasks.value);
      currentUser(user.value);
    });
  };

  //Delete Task:
  const deleteTask = (taskID) => {
    let userID = localStorage.getItem("tempId");
    let currentUser = user.value;
    if (currentUser && currentUser.id === userID) {
      currentUser.tasks = currentUser.tasks.filter(
        (task) => task.taskId !== taskID
      );
      axios
        .put(`http://localhost:3000/users/${userID}`, currentUser)
        .then((res) => {
          console.log("res", res);
          console.log("Task deleted Successfully.");
        })
        .catch((err) => console.log(err));
    } else {
      console.error("User not found");
    }
  };

  return {
    addTask,
    getTask,
    currentUser,
    currentUserId,
    getCurrentUser,
    getCurrentUserId,
    getData,
    deleteTask,
    editData,
    getEditedData,
    updatedTask,
    nextPage,
    prevPage,
    currentPage,
    paginatedTasks,
    filterData,
    resetUpdateTask
  };
});

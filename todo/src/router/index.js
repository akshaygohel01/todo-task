import SignupComp from "@/views/SignupComp.vue";
import LoginComp from "@/views/LoginComp.vue";
import FirstComp from "@/views/FirstComp.vue"
import {createRouter, createWebHistory} from 'vue-router'
import TodoComp from "@/views/TodoComp.vue";
import NotFound from "@/views/NotFound.vue";
import DisplayTask from "@/views/DisplayTask.vue";

const routes = [
    {
        path: "/",
        name: 'signup',
        component: SignupComp
    },

    {
        path: "/login",
        name: 'login',
        component: LoginComp
    },

    {
        path: "/first",
        name: "first",
        component: FirstComp,
        beforeEnter: (to,from,next) =>{
            let isValid = localStorage.getItem('isValid');
            if (to.name !== 'login' && isValid !== 'true') {
                next({ name: 'login' });
            } else {
                next();
            }
        }
    },

    {
        path: "/todo",
        name: "todo",
        component: TodoComp,
        beforeEnter: (to,from,next) =>{
            let isValid = localStorage.getItem('isValid');
            if (to.name !== 'login' && isValid !== 'true') {
                next({ name: 'login' });
            } else {
                next();
            }
        }
    },



    {
        path: "/display-task",
        name: "display",
        component: DisplayTask,
        beforeEnter: (to,from,next) =>{
            let isValid = localStorage.getItem('isValid');
            if (to.name !== 'login' && isValid !== 'true') {
                next({ name: 'login' });
            } else {
                next();
            }
        }
    },

    {
        path: "/:pathMatch(.*)*",
        name: 'not-found',
        component: NotFound
    }
]

const router = createRouter(
    {
        history: createWebHistory(),
        routes: routes
    }
)

router.beforeEach((to)=> {
    let isValid = JSON.parse(localStorage.getItem('isValid'));
    if(isValid == true && (to.name == 'login' || to.name == 'signup')){
        return {name: 'first'}
    }
})

export default router;

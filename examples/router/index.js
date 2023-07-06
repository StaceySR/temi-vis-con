import Vue from 'vue'
import VueRouter from 'vue-router'
import app from '../views/app.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'x6',
        component: app
    },
    {
        path: '*',
        redirect: '/'
    },
]

const router = new VueRouter({
    routes
})

export default router

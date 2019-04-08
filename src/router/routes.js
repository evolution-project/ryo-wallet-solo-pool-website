
const routes = [
    {
        path: "/",
        component: () => import("layouts/pool.vue"),
        children: [
            { path: "", component: () => import("pages/dashboard.vue") },
            { path: "dashboard", component: () => import("pages/dashboard.vue") },
            { path: "blocks", component: () => import("pages/blocks.vue") },
            { path: "getting-started", component: () => import("pages/getting_started.vue") },
            { path: "about", component: () => import("pages/about.vue") },
        ]
    }
]

// Always leave this as last one
if (process.env.MODE !== "ssr") {
    routes.push({
        path: "*",
        component: () => import("pages/Error404.vue")
    })
}

export default routes

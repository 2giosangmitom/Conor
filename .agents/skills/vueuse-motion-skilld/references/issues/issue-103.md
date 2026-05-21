---
number: 103
title: "Animation not working if using :visibleOnce"
type: other
state: closed
created: 2023-03-03
url: "https://github.com/vueuse/motion/issues/103"
reactions: 6
comments: 0
---

# Animation not working if using :visibleOnce

If I have such an object
```
<img src="/img/header.png" class="w-72"
                v-motion
                :initial="{
                    scale: 0.7,
                    opacity: 0,
                }"
                :visibleOnce="{
                    scale: 1,
                    opacity: 1,
                    transition: {
                        duration: 2000,
                    },
                }"
            >
```
and when the page is loaded, if this object is visible to the user immediately, then the animation fires once every other time, and this object is not displayed to the user

I use laravel breeze with vue js,
my app.js
```
import './bootstrap';
import '../css/app.css';

import { createApp, h } from 'vue';

axios.get( '/get-permissions' ).then(
    response => {
        window.Laravel.jsPermissions = response.data.jsPermissions
    }
);

import LaravelPermissionToVueJS from 'laravel-permission-to-vuejs'
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ZiggyVue } from '../../vendor/tightenco/ziggy/dist/vue.m';
import { MotionPlugin } from '@vueuse/motion'

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.vue`, import.meta.glob('./Pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        return createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue, Ziggy)
            .use(LaravelPermissionToVueJS)
            .use(MotionPlugin)
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
```...
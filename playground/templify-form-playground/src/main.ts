import { createApp } from "vue"
import "./style/index.less"
import App from "./App.vue"
import { addPlugins } from "./plugins"

const app = createApp(App)

addPlugins(app)
app.mount("#app")
import "./init"

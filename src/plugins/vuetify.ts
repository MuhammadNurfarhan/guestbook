/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Vuetify

import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/labs/VDateInput";

import { YihQuan } from "@/theme/YihQuan";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput,
  },
  theme: {
    defaultTheme: "YihQuan",
    themes: { YihQuan },
  },
});

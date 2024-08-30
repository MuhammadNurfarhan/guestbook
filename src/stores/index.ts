import { defineStore } from 'pinia';
import axios from 'axios';

export const useMainStore = defineStore('main', {
  state: () => ({
    data: null,
  }),
  actions: {
    async fetchData() {
      try {
        const response = await axios.get('https://api.example.com/data');
        this.data = response.data;
      } catch (error) {
        console.error(error);
      }
    },
  },
});

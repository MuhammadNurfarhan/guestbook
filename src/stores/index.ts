import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';

export const useMainStore = defineStore('main', () => {
  // State
  const data = ref(null);

  // Actions
  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.API_BASE_URL}/api/user`);
      data.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    data,
    fetchData,
  };
});

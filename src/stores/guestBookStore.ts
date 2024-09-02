import { defineStore } from 'pinia';
import { ref } from 'vue';

interface GuestBookEntry {
  name: string;
  message: string;
}

export const useGuestBookStore = defineStore('guestBook', () => {
  // State
  const guestEntries = ref<GuestBookEntry[]>([]);

  // Actions
  const addEntry = (entry: GuestBookEntry) => {
    guestEntries.value.push(entry);
  };

  return {
    guestEntries,
    addEntry,
  };
});

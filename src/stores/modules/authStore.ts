import { ref } from 'vue';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

interface UserData {
  role: string;
  token: string;
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const role = ref<string | null>(localStorage.getItem('role') || null);
  const token = ref<string | null>(localStorage.getItem('token') || null);

  const setUserData = ({ role: newRole, token: newToken }: UserData) => {
    role.value = newRole;
    token.value = newToken;
    localStorage.setItem('role', newRole);
    localStorage.setItem('token', newToken);
  };

  const clearUserData = () => {
    role.value = null;
    token.value = null;
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };

  const handleApiError = (error: unknown, action: string) => {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message || axiosError.message;
      console.error(`Error ${action}:`, errorMessage);
      throw new Error(`Error ${action}: ${errorMessage}`);
    }
    console.error(`Unexpected error ${action}:`, error);
    throw new Error(`Unexpected error ${action}`);
  };

  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      throw new Error('Please fill in all fields');
    }

    try {
      const response = await axios.post<{ message: string }>(`${import.meta.env.VITE_API_URL}/api/user`, {
        email,
        password,
        name,
      });
      console.log(response.data);
      return response.data.message;
    } catch (error) {
      handleApiError(error, 'registering');
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ data: UserData }>(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        email,
        password,
      });

      setUserData(response.data.data);
      router.push({ name: 'Dashboard' });
    } catch (error) {
      handleApiError(error, 'logging in');
    }
  };

  const logout = () => {
    clearUserData();
    router.push('/login');
  };

  const restoreUser = () => {
    const storedRole = localStorage.getItem('role');
    role.value = storedRole || null;
  };

  return {
    role,
    token,
    register,
    login,
    logout,
    restoreUser,
  };
});

import { toast } from 'react-toastify';

export const showSuccessAlert = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000, 
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const showErrorAlert = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
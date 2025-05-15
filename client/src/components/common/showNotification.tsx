import { toast } from 'react-toastify';

export const showNotification = (message: string, err?: boolean): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    err
        ? toast.success(message, {
              position: 'top-center',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          })
        : toast.error(message, {
              position: 'top-center',
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
          });
};

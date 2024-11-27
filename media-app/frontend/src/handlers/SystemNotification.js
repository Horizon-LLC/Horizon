
export const showErrorMess = (text, type, setAlertModal) => {
    setAlertModal({ isOpen: true, text, type });
};
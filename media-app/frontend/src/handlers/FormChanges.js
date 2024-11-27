
export const textChange = (e, formData, setFormData) => {
    setFormData({
        ...formData,
        [e.target.name]: e.target.value,
    });
};

export const dateChange = (value, formData, setFormData) => {
    setFormData({
        ...formData,
        date_of_birth: value ? value.toString() : '',
    });
};

export const selectChange = (selectedValue, formData, setFormData) => {
    setFormData({
        ...formData,
        security_question: selectedValue,
    });
};

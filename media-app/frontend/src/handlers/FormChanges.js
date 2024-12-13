
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

export const selectChange = (value, formData, setFormData) => {
    setFormData({
        ...formData,
        [value.target.name]: value.target.value, // Assign the selected value
    });
};


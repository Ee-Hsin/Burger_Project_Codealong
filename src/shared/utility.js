//This file has been moved out of store, into its own folder, called shared, as it is now used in containers instead of 
//Just the reducers.
export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const checkValidity = (value, rules) => { 
    let isValid = true;

    if (!rules){ //Means no rules
        return true;
    }
    if (rules.required) {
        isValid = (value.trim() !== '') && isValid;//isValid will be true as long as value isn't empty or whitespace
    }

    if (rules.minLength){
        isValid = (value.length >= rules.minLength) && isValid;
    }

    if (rules.maxLength) {
        isValid = (value.length <= rules.maxLength) && isValid;
    }

    //Should have added these 2 rules earlier, but just decided to add this now (I also added the rule in the config above).
    if (rules.isEmail) {
        const pattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric){
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}  
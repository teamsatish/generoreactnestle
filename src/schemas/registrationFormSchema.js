import * as Yup from 'yup';
import { range } from 'lodash'
import { ERROR_MESSAGE } from './errorMessages';


const registationFormSchema = Yup.object({
    firstName: Yup.string()
        .transform((cv, ov) => !!cv ? cv :'')
        .max(25, ERROR_MESSAGE.firstName)
        .required(ERROR_MESSAGE.firstName),
    lastName: Yup.string()
        .transform((cv, ov) => !!cv ? cv :'')
        .max(25, ERROR_MESSAGE.familyName)
        .required(ERROR_MESSAGE.familyName),
    firstNameKana: Yup.string()
        .transform((cv, ov) => !!cv ? cv :'')
        .max(25, ERROR_MESSAGE.firstNameKana)
        .required(ERROR_MESSAGE.firstNameKana),
    lastNameKana: Yup.string()
        .transform((cv, ov) => !!cv ? cv :'')
        .max(25, ERROR_MESSAGE.familyNameKana)
        .required(ERROR_MESSAGE.familyNameKana),
    email: Yup.string()
        .required(ERROR_MESSAGE.emailRequired)
        .email(ERROR_MESSAGE.invalidEmail),
    gender: Yup.mixed()
        .oneOf(['0', '1', '2']),
    dob_year: Yup.string()
        .required(ERROR_MESSAGE.birthYear)
        .oneOf(range(1910, 2008).map((a)=>a.toString()), ERROR_MESSAGE.birthYear)
        .required(ERROR_MESSAGE.birthYear),
    dob_month: Yup.string()
        .required(ERROR_MESSAGE.birthMonth)
        .oneOf(range(1, 13).map((a)=>a.toString()), ERROR_MESSAGE.birthMonth)
        .required(ERROR_MESSAGE.birthYear),
    dob_date: Yup.string()
        .required(ERROR_MESSAGE.birthDate)
        .oneOf(range(1, 32).map((a)=>a.toString()), ERROR_MESSAGE.birthDate)
        .required(ERROR_MESSAGE.birthYear),
    password: Yup.string()
        .required(ERROR_MESSAGE.required)
        .max(8, ERROR_MESSAGE.passwordLength)
        .max(16, ERROR_MESSAGE.passwordLength)
        .matches(/[0-9]/, ERROR_MESSAGE.passwordInvalid)
        .matches(/[a-z]/, ERROR_MESSAGE.passwordInvalid)
        .matches(/[!@#$%^&*()]/, ERROR_MESSAGE.passwordInvalid)
        .required(ERROR_MESSAGE.required),
    confirmPassword: Yup.string()
        .required(ERROR_MESSAGE.required)
        .oneOf([Yup.ref('password'), null], ERROR_MESSAGE.confirmPasswordMismatch)
        .required(ERROR_MESSAGE.required),
})


  export default registationFormSchema;
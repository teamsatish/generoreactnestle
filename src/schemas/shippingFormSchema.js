import * as Yup from 'yup';
import { ERROR_MESSAGE } from './errorMessages';

const deliveryFormSchema = Yup.object({
    deliveryAddress: Yup.object({
        addressName: Yup.string()
            .transform((cv, ov) => !!cv ? cv : '')
            .max(40, ERROR_MESSAGE.required)
            .required(ERROR_MESSAGE.required),
        firstName: Yup.string()
            .transform((cv, ov) => !!cv ? cv : '')
            .max(25, ERROR_MESSAGE.firstName)
            .required(ERROR_MESSAGE.firstName),
        lastName: Yup.string()
            .transform((cv, ov) => !!cv ? cv : '')
            .max(25, ERROR_MESSAGE.familyName)
            .required(ERROR_MESSAGE.familyName),
        firstNameKana: Yup.string()
            .transform((cv, ov) => !!cv ? cv : '')
            .max(25, ERROR_MESSAGE.firstNameKana)
            .required(ERROR_MESSAGE.firstNameKana),
        lastNameKana: Yup.string()
            .transform((cv, ov) => !!cv ? cv : '')
            .max(25, ERROR_MESSAGE.familyNameKana)
            .required(ERROR_MESSAGE.familyNameKana),
        phone: Yup.string()
            .required(ERROR_MESSAGE.phone.required)
            .min(10, ERROR_MESSAGE.phone.inValid)
            .max(11, ERROR_MESSAGE.phone.inValid),
        zipcode: Yup.string()
            .required(ERROR_MESSAGE.zipcode.required)
            .min(7, ERROR_MESSAGE.zipcode.invalid)
            .max(8, ERROR_MESSAGE.zipcode.invalid)
            .matches(/[0-9]/, ERROR_MESSAGE.zipcode.invalid)
            .matches(/[-]/, ERROR_MESSAGE.zipcode.invalid),
        prefecture: Yup.string()
            .required(ERROR_MESSAGE.required),
        city: Yup.string()
            .required(ERROR_MESSAGE.required),
        streetAddress: Yup.string()
            .required(ERROR_MESSAGE.address.required)
            .max(100, ERROR_MESSAGE.address.invalid),
    })
})

export default deliveryFormSchema;
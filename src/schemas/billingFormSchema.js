import * as Yup from 'yup';
import { ERROR_MESSAGE } from './errorMessages';
import { isFullWidth } from './../components/core/utils'

const contactFormSchema = Yup.object({
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
		.required(),
	city: Yup.string()
		.required(),
	address: Yup.string()
		.transform(function (value, originalvalue) {
			return isFullWidth(value) && value !== null ? value : originalvalue;
		})
		.required(ERROR_MESSAGE.address.required)
		.max(100, ERROR_MESSAGE.zipcode.invalid),
})

export default contactFormSchema;
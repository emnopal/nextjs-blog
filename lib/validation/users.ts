import * as Yup from 'yup'

function AddUserSchemaValidation(user: any) {
	return {
		username: Yup.string().required('Username is required'),

		email: Yup.string()
			.email('Please enter a valid email address')
			.required('Email is required'),

		name: Yup.string().required('Name is required'),

		password: Yup.string()
			.transform((value, originalValue) =>
				originalValue === '' ? undefined : value,
			)
			.test(
				'password',
				'Password must be at least 6 characters',
				function (value) {
					if (!user) {
						return Yup.string()
							.required('Password is required')
							.min(6)
							.isValidSync(value)
					}
					return true // Return true if user has a value
				},
			),
	}
}

function EditUserSchemaValidation() {
	return {
		username: Yup.string().required('Username is required'),

		email: Yup.string()
			.email('Please enter a valid email address')
			.required('Email is required'),

		name: Yup.string().required('Name is required'),
	}
}

function RegisterSchemaValidation() {
	return {
		username: Yup.string().required('Username is required'),

		email: Yup.string()
			.email('Please enter a valid email address')
			.required('Email is required'),

		name: Yup.string().required('Name is required'),

		password: Yup.string()
			.required('Password is required')
			.min(6, 'Password must be at least 6 characters'),
	}
}

function LoginSchemaValidation() {
	return {
		username: Yup.string().required('Username is required'),
		password: Yup.string().required('Password is required'),
	}
}

function AddValidationSchema(user: any) {
	return Yup.object().shape(AddUserSchemaValidation(user))
}

function EditValidationSchema() {
	return Yup.object().shape(EditUserSchemaValidation())
}

function LoginValidationSchema() {
	return Yup.object().shape(LoginSchemaValidation())
}

function RegisterValidationSchema() {
	return Yup.object().shape(RegisterSchemaValidation())
}

export const UserValidation = {
	AddUser: AddValidationSchema,
	EditUser: EditValidationSchema,
	Login: LoginValidationSchema,
	Register: RegisterValidationSchema,
}

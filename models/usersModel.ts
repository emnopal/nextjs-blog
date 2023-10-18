import mongoose from 'mongoose'

const Schema = mongoose.Schema

export function userModel() {
	const schema = new Schema(
		{
			username: { type: String, unique: true, required: true },
			email: { type: String, unique: true, required: true },
			name: { type: String, required: true },
			password: { type: String, required: true },
		},
		{
			timestamps: true,
		},
	)

	schema.set('toJSON', {
		virtuals: true,
		versionKey: false,
		transform: function (doc, ret) {
			delete ret._id
			delete ret.hash
		},
	})

	return mongoose.models.User || mongoose.model('User', schema)
}

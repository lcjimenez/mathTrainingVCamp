module.exports = {
	db: 'mongodb://localhost/mean',
	sessionSecret: 'developmentSessionSecret',
	google: {
		clientID: "404989508130-1lq87fnfopkuitch9hb4tfigj04a6la3.apps.googleusercontent.com",
		clientSecret: "Cof-Hnq9tUj5a_RJxUgXeACd",
		callbackURL: "http://localhost:3000/oauth/google/callback"
	},
	//se asegura que el correo de quien ingresa esté vinculado a la Universidad EAN
	domain: "universidadean.edu.co"
};
import bcrypt from 'bcryptjs'

const users = [
	{
		myName: 'Admin User',
		email: 'admin@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'a',
		email: 'a@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'b',
		email: 'b@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'c',
		email: 'c@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'd',
		email: 'd@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'e',
		email: 'e@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'f',
		email: 'f@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'g',
		email: 'g@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'h',
		email: 'h@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'q',
		email: 'q@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'r',
		email: 'r@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'z',
		email: 'z@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'x',
		email: 'x@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'k',
		email: 'k@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
	{
		myName: 'p',
		email: 'p@example.com',
		password: bcrypt.hashSync('123456', 10),
	},
]

export default users


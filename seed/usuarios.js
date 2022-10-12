import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Agustin',
        email: 'test@test.com',
        confirmado: 1,
        password: bcrypt.hashSync('password',10)
    }
]

export default usuarios
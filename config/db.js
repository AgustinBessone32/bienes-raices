import dotenv from 'dotenv'
import Sequelize from 'sequelize'
dotenv.config({path: '.env'})

const db = new Sequelize(process.env.BD_NAME,process.env.BD_USER,process.env.BD_PASS,{
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define :{
        timestamps: true
    },
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle: 10000
    },
    operatorAliases: false
})

export default db
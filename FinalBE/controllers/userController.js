import { countUsers, createUser, getUser, getUserById } from "../models/users.models.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { checkPayload } from "../utils/constants.js";
import { cloneDeep } from "../utils/funconstant.js"
import dotenv from 'dotenv'
import UserModel from "../models/user.js";
dotenv.config()

export const register = async (req, res) => {
    //lấy thông tin user
    const { username, password, email, role } = req.body
    try {
        let roleUser = role
        //check user tồn tại chưa
        const checkUser = await getUser({ username })
        //nếu có rồi thì báo lỗi tk đã tồn tại
        if (checkUser.length) {
            throw new Error('username is exist')
        }
        //mã hóa mk
        const saltRounds = 10
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashPassword = bcrypt.hashSync(password, salt)
        //tạo tk và mk vào DB
        if (!role) {
            roleUser = ['users']
        }
        console.log(hashPassword);

        const newUser = { username, email, password: hashPassword, role: roleUser }

        const createNewUser = await createUser(newUser)
        //trả ra kq
        res.status(200).send({
            message: 'Created',
            user: createNewUser,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const login = async (req, res) => {
    //lấy thông tin user
    const { username, password } = req.body
    try {
        // ktra username có đúng k
        const checkUser = await getUser({ username })
        // k đúng báo lỗi tài khoản k tồn tại
        if (!checkUser.length) {
            throw new Error('username not found')
        }
        // ktra mk xem đúng k
        const checkPassword = bcrypt.compareSync(password, checkUser[0].password)
        // k đúng báo ra lỗi sai mk
        if (!checkPassword) throw new Error('pass or username is incorrect')
        // Báo ok
        const userInfor = {
            userId: checkUser[0]._id,
            username: checkUser[0].username,
        }
        const token = jwt.sign(userInfor, process.env.TOKEN_KEY)
        console.log(token);

        res.status(200).send({
            message: 'Login success',
            token,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const findOneUser = async (req, res) => {
    const { userId } = req.params
    const { isAdmin, loginUserId } = req
    try {
        const findUser = await getUserById(userId)
        if (!findUser) throw Error('Not found')
        res.status(200).send({
            user: findUser,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const getAllUser = async (req, res) => {
    const { pageSize, pageNumber, username } = req.query
    try {
        const totalItems = await countUsers()
        const totalPage = Math.ceil(totalItems / pageSize)
        const skip = (pageNumber - 1) * pageSize
        const payload = { username }
        checkPayload(payload)
        const listUser = await getUser(payload, skip, pageSize)
        res.status(200).send({
            totalPage,
            totalItems,
            currentPage: pageNumber,
            items: listUser,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params
    const { username, email } = req.body
    try {
        const findUser = await getUserById(id)
        console.log(findUser)
        if (!findUser) throw new Error('No user found')
        findUser.username = username
        findUser.email = email
        findUser.save()
        res.status(200).send({
            message: 'Updated!',
            data: findUser,
        })
    } catch (error) {
        res.status(500).send({
            message: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
    res.status(500).json({ message: error.message });
    }
}

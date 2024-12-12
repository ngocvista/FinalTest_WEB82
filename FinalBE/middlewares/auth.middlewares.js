import { getUserById, getUserDB } from "../models/users.models.js";
import { getSession } from "../models/sessions.models.js";
import dotenv from 'dotenv'
import { findOneUser } from "../controllers/users.controllers.js";
dotenv.config()

const authMiddleware = {
    authentication: async (req, res, next) => {
        const { apiKey } = req.query
        const [title, userId1, email1, randomString1] = apiKey.split('-')
        const userId = userId1.replaceAll("$","")
        const email = email1.replaceAll("$","")
        const randomString = randomString1.replaceAll("$","")
        const getUser = await getUserDB({ email })
        const currentUser = getUser[0].username
        try {
            let isAuthenticated = false
            //check trên session username có tồn tại k
            const checkSession = await getSession({ username:currentUser })
            if (checkSession && randomString === checkSession.key) {
                isAuthenticated = true
            }
            //check key
            if (isAuthenticated) {
                // Người dùng đã được xác thực, cho phép truy cập
                next();
            } else {
                throw new Error('Authentication Fail'); // Trả về lỗi 401 nếu không được xác thực
            }
        } catch (error) {
            res.status(401).send({
                message: error.message
            })
        }
    },
    authorizationAdmin: async (req, res, next) => {
        const { loginUserId } = req // sẽ lấy trong token ở bài 8
        console.log('userId', loginUserId)

        try {
            const findUser = await getUserById(loginUserId)
            if (!findUser) throw new Error('Username is not exist')
            const checkRoleAdmin = findUser.role.includes('admin') // Vai trò của người dùng (ví dụ: admin hoặc user)

            if (checkRoleAdmin) {
                req.isAdmin = true
            } else {
                req.isAdmin = false
            }
            next(); // Cho phép truy cập vào route
        } catch (error) {
            res.status(500).send({
                message: error.message
            })
        }
    }
};
export default authMiddleware;
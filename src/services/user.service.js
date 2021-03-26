import { storageService } from './async-storage.service'
import { httpService } from './http.service'
const SCORE_FOR_REVIEW = 10

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
}

window.userService = userService
// Note: due to async, must run one by one...
// userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 100, isAdmin: false})
// userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 100, isAdmin: true})
// userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 100})

function getUsers() {
    // return storageService.query('user')
    return httpService.get(`user`)
}

function getById(userId) {
    // return storageService.get('user', userId)
    return httpService.get(`user/${userId}`)
}
function remove(userId) {
    // return storageService.remove('user', userId)
    return httpService.delete(`user/${userId}`)
}

async function update(userToUpdate) {
    // return storageService.put('user', user)
    if (getLoggedinUser()._id === userToUpdate._id) _saveLocalUser(userToUpdate)
    return httpService.put(`user/${userToUpdate._id}`, userToUpdate)
}


async function login(userCred) {
    // const users = await storageService.query('user')
    // const user = users.find(user => user.username === userCred.username)
    // return _saveLocalUser(user)
    const user = await httpService.post('auth/login', userCred)
    if (user) return _saveLocalUser(user)
}
async function signup(userCred) {
    // const user = await storageService.post('user', userCred)
    const user = await httpService.post('auth/signup', userCred)
    return _saveLocalUser(user)
}
async function logout() {
    sessionStorage.clear()
    return await httpService.post('auth/logout')
}


function _saveLocalUser(user) {
    sessionStorage.setItem('loggedinUser', JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem('loggedinUser'))
}


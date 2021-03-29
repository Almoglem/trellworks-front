import { storageService } from './async-storage.service'
import { utilService } from './util.service'
import { httpService } from './http.service'

// const BOARD_DB = 'boards'
const BOARD_URL = 'board/'

export const boardService = {
    query,
    getById,
    remove,
    save,
    addBoard,
    getEmptyTask,
    getEmptyGroup,
    getEmptyLabel,
    getDefaultLabels,
    getLabelColorById,
    getAllColors,
    getAllGradients
}

async function query(isMinimized) {
    // return storageService.query(BOARD_DB)
    return httpService.get(BOARD_URL, isMinimized)
}

async function getById(boardId) {
    // return storageService.get(BOARD_DB, boardId)
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    // return storageService.remove(BOARD_DB, boardId)
    return httpService.delete(`board/${boardId}`)
}

async function addBoard(loggedinUser) {
    await save(_getEmptyBoard(loggedinUser))
}

async function save(board) {
    if (!board._id) {
        // return storageService.put(BOARD_DB, board)
        return httpService.post(BOARD_URL, board)
    } else {
        // return storageService.post(BOARD_DB, board)
        return httpService.put(BOARD_URL + board._id, board)
    }
}

function _getEmptyBoard(loggedinUser) {
    const members = (loggedinUser._id === "000" ? [] : [loggedinUser]);
    return {
        title: 'My new board',
        createdAt: Date.now(),
        labels: getDefaultLabels(),
        groups: [],
        styles: {
            backgroundColor: '#61bd4f',
            backgroundImage: ''
        },
        members,
        activities: [
            {
                id: utilService.makeId(),
                title: 'created this board',
                createdAt: Date.now(),
                byMember: loggedinUser,
                task: { id: '', title: '' }
            }
        ],
        isStarred: false
    }
}


function getEmptyGroup() {
    return {
        id: utilService.makeId(),
        style: {},
        title: 'My new list',
        task: []
    }
}

function getEmptyTask() {
    //// add more properties later here such as: description, etc. as we go!////
    return {
        id: utilService.makeId(),
        createdAt: Date.now(),
        title: '',
        dueDate: '',
        isCompleted: false,
        labelIds: [],
        description: '',
        checklists: [],
        members: [],
        imgs: [
        ],
        cover: {
            isImg: false,
            type: 'top',
            src: ''
        }
    }
}

function getLabelColorById(board, labelId) {
    return board.labels.find(label => {
        return label.id === labelId
    })
}

function getDefaultLabels() {
    const defaultColors = [
        {
            color: '#61bd4f',
            colorName: 'green',
            id: 'l101'
        },
        {
            color: '#f2d600',
            colorName: 'yellow',
            id: 'l102'
        },
        {
            color: '#ff9f1a',
            colorName: 'orange',
            id: 'l103'
        },
        {
            color: '#eb5a46',
            colorName: 'red',
            id: 'l104'
        },
        {
            color: '#c377e0',
            colorName: 'purple',
            id: 'l105'
        },
        {
            color: '#0079bf',
            colorName: 'blue',
            id: 'l106'
        }
    ]
    return defaultColors.map(color => {
        return getEmptyLabel(color.color, color.colorName, color.id)
    })
}
function getAllGradients() {
    return [{
        color: `linear-gradient(to left,#856368,#796f9e)`,
        colorName: 'gradient-1',
    },
    {
        color: 'linear-gradient(to left, #b2b58c, #c7809b )',
        colorName: 'gradient-2'
    },
    {
        color: 'linear-gradient(to left,   #b1c5b5, #5c8f95 )',
        colorName: 'gradient-3'
    },
    {
        color: 'linear-gradient(to left,#f1cdd4,#c35432)',
        colorName: 'gradient-4'
    },
    {
        color: 'linear-gradient(to right top, #38438b, #944b94, #d75a88, #ff7e71, #ffb25f, #ffeb68)',
        colorName: 'gradient-5'
    },
    {
        color: 'linear-gradient(to right top, #6d327c, #485DA6, #00a1ba, #00BF98, #36C486)',
        colorName: 'gradient-6'
    },
    {
        color: 'linear-gradient(to right top, #0bff00, #ddc700, #ff7500, #ff0072, #eb12cf)',
        colorName: 'gradient-7'
    },
    {
        color: 'linear-gradient(to left bottom, #03c1c9, #00d8bc, #3aeb98, #93f962, #e9ff00)',
        colorName: 'gradient-8'
    },
    ]
}

function getAllColors() {
    return [{
        color: '#61bd4f',
        colorName: 'green'
    },
    {
        color: '#f2d600',
        colorName: 'yellow'
    },
    {
        color: '#ff9f1a',
        colorName: 'orange'
    },
    {
        color: '#eb5a46',
        colorName: 'red'
    },
    {
        color: '#c377e0',
        colorName: 'purple'
    },
    {
        color: '#0079bf',
        colorName: 'blue'
    },
    {
        color: '#00c2e0',
        colorName: 'skyblue'
    },
    {
        color: '#51e898',
        colorName: 'lime'
    },
    {
        color: '#ff78cb',
        colorName: 'pink'
    },
    {
        color: '#344563',
        colorName: 'black'
    }];
}

function getEmptyLabel(color = '', colorName, colorId) {
    return {
        title: '',
        color,
        colorName,
        id: colorId
    }
}

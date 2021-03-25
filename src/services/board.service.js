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
    getAllColors
}

async function query() {
    // return storageService.query(BOARD_DB)
    return httpService.get(BOARD_URL)
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
    return {
        title: 'My new board',
        createdAt: Date.now(),
        labels: getDefaultLabels(),
        groups: [],
        styles: {
            backgroundColor: '#61bd4f'
        },
        members: [
            ],
        activities: [
            {
                id: utilService.makeId(),
                title: 'created this board',
                createdAt: Date.now(),
                byMember:  loggedinUser,
                task: { id: '', title: '' }
            }
        ],
        isStarrted:false
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
        imgs: [],
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

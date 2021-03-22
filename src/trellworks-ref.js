// Guidelines
// *. Save the entire board, dont handle mini-updates
// *. No need for saving an activities array per card, those activities are easily filtered from the board activities
// *. activites - when board is updated, the frontend does not send the activities array within the board 
//    instead it only sends a new activity object: {txt, boardId, listId, cardId}
//    the backend adds this activity to the board with $push and can also emit socket notificatios
// *. D & D Guidelines - vuedraggable 
// *. Same model for Monday style app (do not implement a generic columns feature)https://github.com/TomerPinto1986/trililo/blob/main/frontend/src/services/board.service.js
// *. boardStore no need for list/card stores
// *. rendering performance
// *. we do not handle concurrent editing - needs versioning



async function saveCard({ commit }, {card}) {
    try {
        const boardId = 'u101'
        const card = await boardService.saveCard(boardId, card);
        commit({ type: 'setCard', card })
    } catch (err) {
        console.log('boardStore: Error in loadBoard', err)
        throw err
    }
}

async function loadBoard({ commit }) {
    try {
        const boardId = 'u101'
        const board = await boardService.getById(boardId);
        commit({ type: 'setBoard', board })
        socketService.emit('watch-board', boardId) // join('u101')
        socketService.off('board-updated')
        socketService.on('board-updated', board => {
            commit({ type: 'setBoard', board })
        })
        socketService.on('card-updated', card => {
            commit({ type: 'saveCard', card })
        })

    } catch (err) {
        console.log('boardStore: Error in loadBoard', err)
        throw err
    }
}



// *. render optimization


const board = {
    "_id": "b101",
    "title": "Robot dev proj",
    "createdAt": 1589983468418,
    "createdBy": {
        "_id": "u101",
        "fullname": "Abi Abambi",
        "imgUrl": "http://some-img"
    },
    "style": {},
    "labels": [
        {
            "id": "l101",
            "title": "Done",
            "color": "#61bd4f"
        }
    ],
    "members": [
        {
            "_id": "u101",
            "fullname": "Tal Tarablus",
            "imgUrl": "https://www.google.com"
        }
    ],
    "lists": [
        {
            "id": "g101",
            "title": "list 1",
            "cards": [
                {
                    "id": "c101",
                    "title": "Replace logo"
                },
                {
                    "id": "c102",
                    "title": "Add Samples"
                }
            ],
            "style": {}
        },
        {
            "id": "g102",
            "title": "list 2",
            "cards": [
                {
                    "id": "c103",
                    "title": "Do that"
                },
                {
                    "id": "c104",
                    "title": "Help me",
                    "description": "description",
                    "comments": [
                        {
                            "id": "ZdPnm",
                            "txt": "also @yaronb please CR this",
                            "createdAt": 1590999817436.0,
                            "byMember": {
                                "_id": "u101",
                                "fullname": "Tal Tarablus",
                                "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                            }
                        }
                    ],
                    "checklists": [
                        {
                            "id": "YEhmF",
                            "title": "Checklist",
                            "todos": [
                                {
                                    "id": "212jX",
                                    "title": "To Do 1",
                                    "isDone": false
                                }
                            ]
                        }
                    ],
                    "members": [
                        {
                            "_id": "u101",
                            "username": "Tal",
                            "fullname": "Tal Tarablus",
                            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                        }
                    ],
                    "labelIds": ["101"],
                    "createdAt": 1590999730348,
                    "dueDate": 16156215211,
                    "byMember": {
                        "_id": "u101",
                        "username": "Tal",
                        "fullname": "Tal Tarablus",
                        "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                    },
                    "style": {
                        "bgColor": "#26de81"
                    }
                }
            ],
            "style": {}
        }
    ],
    "activities": [
        {
            "id": "a101",
            "txt": "Changed Color",
            "createdAt": 154514,
            "byMember": {
                "_id": "u101",
                "fullname": "Abi Abambi",
                "imgUrl": "http://some-img"
            },
            "card": {
                "id": "c101",
                "title": "Replace Logo"
            }
        }
    ]
}
const user = {
    "_id": "u101",
    "fullname": "Abi Abambi",
    "username": "abi@ababmi.com",
    "password": "aBambi123",
    "imgUrl": "http://some-img.jpg",
    "mentions": [{
        "id": "m101",
        "boardId": "m101",
        "cardId": "t101"
    }]
}


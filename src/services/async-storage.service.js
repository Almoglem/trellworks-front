export const storageService = {
    query,
    get,
    post,
    put,
    remove,
}

function query(entityType) {
    var entities = JSON.parse(localStorage.getItem(entityType)) || []
    return Promise.resolve(entities)
}


function get(entityType, entityId) {
    return query(entityType)
        .then(entities =>
            entities.find(entity => entity._id === entityId))
}

function post(entityType, newEntity) {
    newEntity._id = _makeId()
    return query(entityType)
        .then(entities => {
            entities.push(newEntity)
            _save(entityType, entities)
            return newEntity
        })
}

function postMany(entityType, newEntities) {
    return query(entityType)
        .then(entities => {
            newEntities = newEntities.map(entity => ({
                ...entity,
                _id: _makeId()
            }))
            entities.push(...newEntities)
            _save(entityType, entities)
            return newEntity
        })
}



function put(entityType, updatedEntity) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
            entities.splice(idx, 1, updatedEntity)
            _save(entityType, entities)
            return updatedEntity
        })
}

function remove(entityType, entityId) {
    return query(entityType)
        .then(entities => {
            const idx = entities.findIndex(entity => entity._id === entityId)
            entities.splice(idx, 1)
            _save(entityType, entities)
        })
}


function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

function getDefaultLabels() {
    const defaultColors = ['#61bd4f', '#f2d600', '#ff9f1a', '#eb5a46', '#c377e0', '#0079bf']
    return defaultColors.map(color => {
        return getEmptyLabel(color)
    })
}

const boardsDB = [
  {
    "title": "My new board",
    "createdAt": 1616402284269,
    "labels": [
      {
        "title": "",
        "color": "#61bd4f",
        "colorName": "green",
        "id": "l101"
      },
      {
        "title": "",
        "color": "#f2d600",
        "colorName": "yellow",
        "id": "l102"
      },
      {
        "title": "",
        "color": "#ff9f1a",
        "colorName": "orange",
        "id": "l103"
      },
      {
        "title": "",
        "color": "#eb5a46",
        "colorName": "red",
        "id": "l104"
      },
      {
        "title": "",
        "color": "#c377e0",
        "colorName": "purple",
        "id": "l105"
      },
      {
        "title": "",
        "color": "#0079bf",
        "colorName": "blue",
        "id": "l106"
      }
    ],
    "groups": [
      {
        "id": "wiqIB",
        "style": {},
        "title": "My new list",
        "task": [
          {
            "id": "um96X",
            "title": "Task",
            "dueDate": "",
            "labelIds": [],
            "description": "",
            "checklists": [],
            "members": [],
            "imgs": []
          },
          {
            "id": "0dzCo",
            "title": "Another task",
            "dueDate": "",
            "labelIds": [],
            "description": "",
            "checklists": [],
            "members": [],
            "imgs": []
          }
        ]
      },
      {
        "id": "WKaI5",
        "style": {},
        "title": "My new list",
        "task": [
          {
            "id": "2PVU3",
            "title": "Add tasks here",
            "dueDate": "",
            "labelIds": [],
            "description": "",
            "checklists": [],
            "members": [],
            "imgs": []
          }
        ]
      },
      {
        "id": "FgTIF",
        "style": {},
        "title": "New list name",
        "task": [
          {
            "id": "h24XH",
            "title": "We have new tasks",
            "dueDate": "",
            "labelIds": [],
            "description": "",
            "checklists": [],
            "members": [],
            "imgs": []
          }
        ]
      }
    ],
    "styles": {
      "backgroundColor": "#344563"
    },
    "members": [
      {
        "_id": "u102",
        "fullname": "Almog Lemberg",
        "imgUrl": "https://www.google.com"
      },
      {
        "_id": "u103",
        "fullname": "Gali Nickel",
        "imgUrl": "https://www.google.com"
      },
      {
        "_id": "u101",
        "fullname": "Guy Zohar",
        "imgUrl": "https://www.google.com"
      }
    ],
    "activities": [
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "changed this board`s background color",
        "createdAt": 1616402326991,
        "id": "iogIK",
        "task": {
          "id": "",
          "title": ""
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "renamed a group in the board",
        "createdAt": 1616402317447,
        "group": "New list name",
        "id": "ul4GP",
        "task": {
          "id": "",
          "title": ""
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the task \"We have new tasks\" in \"My new list\"",
        "createdAt": 1616402312473,
        "group": "My new list",
        "id": "VqbHB",
        "task": {
          "id": "h24XH",
          "title": "We have new tasks"
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the task \"Add tasks here\" in \"My new list\"",
        "createdAt": 1616402305381,
        "group": "My new list",
        "id": "6Qe2W",
        "task": {
          "id": "2PVU3",
          "title": "Add tasks here"
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the task \"Another task\" in \"My new list\"",
        "createdAt": 1616402300387,
        "group": "My new list",
        "id": "LmAhq",
        "task": {
          "id": "0dzCo",
          "title": "Another task"
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the task \"Task\" in \"My new list\"",
        "createdAt": 1616402295872,
        "group": "My new list",
        "id": "Wbens",
        "task": {
          "id": "um96X",
          "title": "Task"
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the group \"My new list\" to the board",
        "createdAt": 1616402289617,
        "group": "My new list",
        "id": "KJrLg",
        "task": {
          "id": "",
          "title": ""
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the group \"My new list\" to the board",
        "createdAt": 1616402288872,
        "group": "My new list",
        "id": "6kIEO",
        "task": {
          "id": "",
          "title": ""
        }
      },
      {
        "byMember": {
          "fullname": "Guest"
        },
        "title": "added the group \"My new list\" to the board",
        "createdAt": 1616402288192,
        "group": "My new list",
        "id": "Ldq16",
        "task": {
          "id": "",
          "title": ""
        }
      },
      {
        "id": "sJQ8e",
        "title": "This board was created",
        "createdAt": 1616402284269,
        "byMember": {
          "fullname": "Guest"
        },
        "task": {
          "id": "",
          "title": ""
        }
      }
    ],
    "_id": "YhGzf"
  }
]

function getBoards() {
    var boards = JSON.parse(localStorage.getItem('boards'))
    if (!boards || !boards.length) {
        console.log('loaded initial db');
        boards = boardsDB;
        _save('boards', boardsDB)
    }
    return Promise.resolve(boards)
}
getBoards()

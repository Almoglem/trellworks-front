import { boardService } from '../services/board.service.js'

export const boardStore = {
    state: {
        boards: null,
        currBoard: null,
        currGroup: null,
        currTask: null,
        labelFilter: '',
        membersFilter: ''
    },
    getters: {
        boards(state) {
            return state.boards;
        },
        currBoard(state) {
            return state.currBoard
        },
        currGroup(state) {
            return state.currGroup
        },
        currBoardMembers(state) {
            return state.currBoard.members
        },
        currTask(state) {
            return state.currTask
        },
        activityLog(state) {
            return state.currBoard.activities
        },
        boardLabelsForShow(state) {
            const labelsForShow = JSON.parse(JSON.stringify(state.currBoard.labels))
            if (!state.labelFilter) return labelsForShow
            return labelsForShow.filter(label => {
                return (label.colorName.includes(state.labelFilter) || label.title.includes(state.labelFilter))
            })
        },
        boardMembersForShow(state) {
            const membersForShow = JSON.parse(JSON.stringify(state.currBoard.members))
            if (!state.membersFilter) return membersForShow
            return membersForShow.filter(member => {
                return (member.fullname.toLowerCase().includes(state.membersFilter.toLowerCase()))
            })
        }
    },
    mutations: {
        setBoards(state, { foundBoards }) {
            state.boards = foundBoards
        },
        setBoard(state, { board }) {
            state.currBoard = board;
        },
        setGroup(state, { groupId }) {
            const currGroup = state.currBoard.groups.find(group => group.id === groupId)
            if (currGroup) state.currGroup = currGroup
        },
        setTask(state, { taskId }) {
            state.currBoard.groups.forEach(group => {
                let task = group.task.find(currTask => currTask.id === taskId)
                if (task) state.currGroup = group
            })
            const currTask = state.currGroup.task.find(task => task.id === taskId);
            if (currTask) state.currTask = currTask;
        },
        setLabelsFilter(state, { filterTxt }) {
            state.labelFilter = filterTxt
        },
        setMembersFilter(state, { filterTxt }) {
            state.membersFilter = filterTxt
        },
    },
    actions: {
        async loadBoards({ commit }) {
            try {
                const foundBoards = await boardService.query(true);
                commit({ type: 'setBoards', foundBoards })
            } catch (err) {
                console.log('Error loading boards');
                throw err.message
            }
        },
        async getBoard({ commit }, { boardId }) {
            try {
                const foundBoard = await boardService.getById(boardId);
                commit({ type: 'setBoard', board: foundBoard })
            } catch (err) {
                console.log('Error loading your board', err)
                throw err.message
            }
        },
        async updateBoard(context, { editedBoard }) {
            try {
                //FIXME: add reverting to previous board if an error is encountered
                context.commit({ type: 'setBoard', board: editedBoard });
                await boardService.save(editedBoard)
            } catch (err) {
                console.log('error saving board changes', err.message);
                throw err.message
            }
        },
        async newBoard({ commit }, payload) {
            const user = payload.loggedUser
            try {
                await boardService.addBoard(user)
                const boards = await boardService.query();
                commit({ type: 'setBoards', boards })
            }
            catch (err) {
                console.log('Adding new board: Error', err);
                throw err.message
            }
        },
        async removeBoard({ commit }, payload) {
            try {
                await boardService.remove(payload.boardId)
                const boards = await boardService.query();
                commit({ type: 'setBoards', boards })
            }
            catch (err) {
                console.dir(err);
                throw err.message
            }
        }
    }
}
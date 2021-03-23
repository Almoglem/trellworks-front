import { utilService } from './util.service'
export const activityService = {
  add,
}

async function add(activityPayload) {
  const date = Date.now()
  activityPayload.board.activities.unshift({
    byMember: { fullname: 'Guest' },
    title: activityPayload.activity,
    createdAt: date,
    group: activityPayload.group.title,
    id: utilService.makeId(),
    task: { id: activityPayload.task.id, title: activityPayload.task.title }
  })
}

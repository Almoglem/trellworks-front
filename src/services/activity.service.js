import { httpService } from './http.service'
import { storageService } from './async-storage.service'
import { userService } from './user.service'
import { utilService } from './util.service'
import moment from 'moment'
export const activityService = {
  add,
  query,
  remove
}


function query(filterBy) {
  // return httpService.get('activity', filterBy)
  return storageService.query('activity')
}

function remove(activityId) {
  // return httpService.delete(`review/${activityId}`)
  return storageService.delete('activity', activityId)
  /// can only delete comments

}
async function add(activityPayload) {
  //TEMPORARY FUNCTION FOR NOW- UPDATE WHEN DONE WORKING WITH LOCAL STORAGE
  // const addedActivity = await httpService.post(`activity`, activity)
  // const addedActivity = storageService.post('activity', activityId)
  const date = Date.now()
  activityPayload.board.activities.unshift({
    byMember: { fullname: 'Guest' },
    title: activityPayload.activity,
    createdAt: date,
    group: activityPayload.group.title,
    id: utilService.makeId(),
    task: { id: activityPayload.task.id, title: activityPayload.task.title }
  })
  // return addedActivity
}

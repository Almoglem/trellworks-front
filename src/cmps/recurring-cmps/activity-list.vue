<template>
	<section class="activity-log">
		<i class="far fa-list-alt fa-lg"></i>
		<h2 class="details-title">Activity Log</h2>
		<span v-if="showtoggleActivity" class="flex activitylog-commenttoggle">
			<h3 class="uppercase-title">Show Activity</h3>
			<el-switch
			:style="{paddingBottom: '6px'}"
				v-model="showComments"
				active-color="#13ce66"
				inactive-color="#eaecf0"
				@change="toggleActivity"
		/></span>
		<div class="activity-container">
			<section
				v-for="activity in activities"
				:key="activity.id"
				class="activity-container"
			>
				<section
					class="flex activity"
					style="margin-bottom: 0"
					:class="{ comment: activity.isComment }"
				>
					<span class="avatar">
						<userPic :user="activity.byMember" :size="30" />
					</span>
					<span class="flex activity-details">
						<span>
							<span style="font-weight: bold"
								>{{ activity.byMember.fullname }}
							</span>
							{{ activity.title }}
						</span>
						<span class="activity-time flex">
							<span class="muted-txt">{{ time(activity.createdAt) }}</span>
							<p
								@click="replyToComment(activity.id)"
								v-if="activity.isComment"
								class="clickable"
								style="margin: 0 8px"
							>Reply
							</p>
						</span>
					</span>
				</section>
				<section
					v-if="activity.replies"
					class="comment reply"
					style="margin-left: 25px"
				>
					<span
						class="flex activity"
						v-for="(reply, idx) in activity.replies"
						:key="idx"
						style="margin-top: 0"
					>
						<span class="avatar">
						<userPic :user="reply.byMember" :size="30" />
						</span>
						<span class="flex activity-details">
							<span>
								<span style="font-weight: bold"
									>{{ reply.byMember.fullname }}
								</span>
								{{ reply.title }}
							</span>
							<span class="activity-time flex">
								<span class="muted-txt">{{ time(reply.createdAt) }}</span>
							</span>
						</span>
					</span>
				</section>
			</section>
			
		</div>
	</section>
</template>

<script>
import moment from "moment";
import userPic from "./user-pic.vue";


export default {
	props: {
		activities: Array,
		showtoggleActivity: Boolean
	},
	data() {
		return {
			showComments: true
		}
	},
	methods: {
		moment: function () {
			return moment();
		},
		time(date) {
			return moment(date).fromNow();
		},
		replyToComment(activityId) {
			this.$emit('replyClicked', activityId)
		},
		toggleActivity() {
			this.$emit('toggleActivity', this.showComments)
		}
	},
	components: { userPic },
};
</script>
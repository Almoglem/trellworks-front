<template>
	<section class="activity-log">
		<i class="far fa-list-alt fa-lg"></i>
		<h2 class="details-title">Activity Log</h2>
		<span v-if="showToggleComments " class="flex activitylog-commenttoggle">
			<h3 class="uppercase-title">Show Comments</h3>
			<el-switch
				v-model="showComments"
				active-color="#13ce66"
				inactive-color="#eaecf0"
				@change="toggleComments"
		/></span>

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
					<img
						v-if="activity.byMember.profileImg"
						class="user-profileimg"
						:src="activity.byMember.profileImg"
						alt=""
					/>
					<avatar
						v-else
						:size="30"
						:username="activity.byMember.fullname"
					></avatar>
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
						>
							Reply
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
						<img
							v-if="reply.byMember.profileImg"
							class="user-profileimg"
							:src="reply.byMember.profileImg"
							alt=""
						/>
						<avatar
							v-else
							:size="30"
							:username="reply.byMember.fullname"
						></avatar>
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
	</section>
</template>

<script>
import moment from "moment";
import Avatar from "vue-avatar";

export default {
	props: {
		activities: Array,
		showToggleComments: Boolean
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
		toggleComments() {
			this.$emit('toggleComments', this.showComments)
		}
	},
	components: { Avatar },
};
</script>
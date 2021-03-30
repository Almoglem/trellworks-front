<template>
	<section class="login-signup">
		<appHeader />
		<div class="login-signup-container flex">
			<div class="graphic">
				<lottie-player
					autoplay
					loop
					mode="normal"
					speed="0.5"
					src="https://assets7.lottiefiles.com/packages/lf20_d3yazmwr.json"
					class="login-hero"
				>
				</lottie-player>
			</div>
      <div class="login-container">
			<div v-if="isLogin" class="form-wrapper login">
				<form @submit.prevent="doLogin">
					<h2>Login</h2>
					<input
						type="text"
						v-model="loginCred.username"
						placeholder="User name"
						required
					/><input
						type="password"
						v-model="loginCred.password"
						placeholder="Password"
						required
					/><button type="submit">Login</button>
				</form>
				<span
					>Don't have an account?
					<span class="clickable bold" @click="isLogin = false"
						>Sign Up</span
					></span
				>
			</div>
			<div v-else class="form-wrapper signup">
				<h2>Register</h2>
				<div class="form">
					<form @submit.prevent="doSignup">
						<label>
							<input
								type="text"
								v-model="signupCred.fullname"
								placeholder="Your full name"
								required
							/>
						</label>
						<label>
							<input
								type="text"
								v-model="signupCred.username"
								placeholder="Username"
								required
							/>
						</label>
						<label>
							<input
								type="password"
								v-model="signupCred.password"
								placeholder="Password"
								required
							/>
						</label>
						<button type="submit">Signup</button>
					</form>
					<div class="profile-image">
						<label for="file-upload">
							<div :style="profileToShow" class="image">
								<img
									v-if="!this.signupCred.profileImg"
									src="../assets/img/profile-img.png"
								/>
								<img v-else :src="profileToShow" />
							</div>
							<a class="clickable">Add a profile image</a>
						</label>
						<input
							type="file"
							id="file-upload"
							:style="{ display: 'none' }"
							@change="addProfileImage"
						/>
					</div>
				</div>
				<span
					>Have an account?
					<span class="clickable bold" @click="isLogin = true">Log in</span>
				</span>
			</div>
			<loader v-if="isLoading" />
      </div>
		</div>
	</section>
</template><script>
import appHeader from "@/cmps/app-header";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import loader from "@/cmps/recurring-cmps/loader";
import { uploadImg } from "@/services/img-upload.service";

export default {
	name: "test",
	data() {
		return {
			loginCred: {
				username: "",
				password: "",
			},

			signupCred: {
				username: "",
				password: "",
				fullname: "",
				profileImg: "",
			},
			isLogin: true,
			isLoading: false,
		};
	},

	computed: {
		users() {
			return this.$store.getters.users;
		},

		loggedinUser() {
			return this.$store.getters.loggedinUser;
		},

		profileToShow() {
			return this.signupCred.profileImg;
		},
	},
	created() {
		this.loadUsers();
	},

	methods: {
		async doLogin() {
			try {
				await this.$store.dispatch({
					type: "login",
					userCred: this.loginCred,
				});
				this.$router.push("/");
			} catch (err) {
				this.showErrorMsg(
					"Failed to log in. please re-check your entered username and password"
				);
			}
		},

		async doSignup() {
			try {
				await this.$store.dispatch({
					type: "signup",
					userCred: this.signupCred,
				});
				this.$router.push("/");
			} catch (err) {
				this.showErrorMsg(err.response.data.err);
			}
		},

		loadUsers() {
			this.$store.dispatch({
				type: "loadUsers",
			});
		},
		async addProfileImage(ev) {
			this.isLoading = true;
			try {
				const imgUploaded = await uploadImg(ev);
				this.signupCred.profileImg = imgUploaded.url;
			} catch (err) {
				this.showErrorMsg("Sorry, there was a problem uploading your image.");
			} finally {
				this.isLoading = false;
			}
		},
		showErrorMsg(msg) {
			Swal.fire({
				position: "bottom-end",
				title: msg,
				showConfirmButton: false,
				timer: 2500,
				timerProgressBar: true,
				customClass: {
					title: "error",
					popup: "error",
				},
				toast: true,
			});
		},
		// potential future use- to delete account
		// async removeUser(userId) {
		//   try {
		//     await this.$store.dispatch({
		//       type: "removeUser",
		//       userId,
		//     });
		//     this.msg = "User removed";
		//   } catch (err) {
		//     this.showErrorMsg("Failed to remove user");
		//   }
		// },
	},
	components: {
		loader,
		appHeader,
	},
};
</script>
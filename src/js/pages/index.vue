<template>
	<section class="page">
		<span>
			<div class="card">
				<div style="background-image: url(http://www.trendycovers.com/covers/walter_white_breaking_bad_facebook_cover_1407231074.jpg);height: 120px;background-size: cover;background-position: 0px -13px;"></div>				
				<div class="card-body" :class="{'loading': loading}">
					<template v-if="!ready">
						<h3 class="text-center mb-3">Movie Recommendation</h3>
						
						<span v-for="(step, index) in steps" v-show="index == currentStep">
							<label class="mt-1 mb-3 text-center w-100">
								{{ step.title }}
							</label>
							<div class="text-center">
								<div class="radio" 
									 v-for="(option, i) in step.options">
									<input type="radio"
										   :id="step.model+i" 
										   :value="option.value" 											   
										   v-model="form[step.model]">

									<label :for="step.model+i">
										{{ option.text }}
									</label>
								</div>
							</div>
							<div class="error" v-if="error">Field is required!</div>							
						</span>

						<div class="text-right mt-auto">
							<span v-if="currentStep != steps.length - 1">
								<button class="btn btn-success" @click="nextStep">Next</button>
							</span>
							<span v-else>
								<button class="btn btn-success" @click="submit">Submit</button>
							</span>
						</div>
					</template>
					<template v-else>
						<div class="d-flex">
							<span>
								<img class="movie-img" :src="movie.image">
							</span>
							<span>
								<h5 class="title">{{ movie.title }}</h5>
								<p class="meta text-muted">{{ movie.subtext }}</p>
								<p class="desc text-muted">{{ movie.desc }}</p>
								<a class="btn btn-primary" :href="movie.link" target="_block">More details</a>
							</span>
						</div>
					</template>
				</div>
			</div>
		</span>
	</section>
</template>

<script>
    export default {
		data: function () {
			return {
				form: {
					category: '',
					sort: ''
				},
				steps: [
					{
						title: 'Who are you going to watch with?',
						options: [
							{value: 'family', text: 'Family'}, 
							{value: 'partner', text: 'Partner'}, 
							{value: 'alone', text: 'Alone'}, 
						],
						model: ''
					},
					{
						title: 'Enter your preferred genre:',
						options: [
							{value: 'drama', text: 'Drama'}, 
							{value: 'action', text: 'Action'}, 
							{value: 'comedy', text: 'Comedy'}, 
							{value: 'fantasy', text: 'Fantasy'}, 
							{value: 'romance', text: 'Romance'}, 
							{value: 'adventure', text: 'Adventure'}, 
							{value: 'animation', text: 'Animation'}, 
							{value: 'horror', text: 'Horror'}, 
						],
						model: 'category'
					},
					{
						title: 'What kind of movies do you like to watch?',
						options: [
							{value: 'year,asc', text: 'Classic'}, 
							{value: 'year,desc', text: 'Modern'}, 
							{value: 'user_rating,desc', text: 'Top Rated'}, 
						],
						model: 'sort'						
					}
				],
				movie: {
					image: "",
					link: "",
					title: "",
					subtext: "",
					desc: "",
				},
				currentStep: 0,				
				error: false,				
				ready: false,				
				loading: false
			}
		},
		methods: {
			submit: function () {
    			let _this = this;
    			let lastModel = _this.steps[_this.steps.length - 1].model;
    			if(!_this.form[lastModel]) {
    				_this.error = true;
    				return false;
    			}

    			_this.loading = true;
    			this.$http.get('/scrape/movie?category=' + _this.form.category + '&sort=' + _this.form.sort).then((res) => {
    				let data = res.data.data;
    				_this.movie = {
						image: data.image,
						link: data.link,
						title: data.title,
						subtext: data.subtext,
						desc: data.desc
    				}
    				_this.ready = true;
    				_this.loading = false
    			}).catch((error) => {
    				_this.loading = false;
					console.log(error)
				})
			},
			nextStep: function () {
    			let model = this.steps[this.currentStep].model;
    			if(!this.form[model]) {
    				this.error = true;
    				return false;
    			}

    			return this.currentStep++;
			}
		},
		watch: {
			form: {
				handler: function() {
					this.error = false;
				},
				deep: true
			}
		}
    }
</script>

<style lang="scss" scoped="">
	.page {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	.card {
		width: 550px;		
		max-width: 100%;
		background-color: rgba(255,255,255,0.92);
		border-radius: 10px;
		border: none;
		min-height: 370px;
		box-shadow: 0 10px 10px 5px rgba(23, 101, 168, 0.10);
		overflow: hidden;
		& .card-body {
			display: flex;
			flex-direction: column;
			position: relative;
		}
	}
	.error {
		font-size: 11px;
		font-weight: 500;
		color: #b30f0f;
		text-align: right;
		margin-bottom: 4px;
	}
	.movie-img {
		margin-right: 30px;
		max-width: 130px;
	}
	.title {
		margin-bottom: 0;
		font-weight: bold;
		font-size: 21px;
	}
	.meta {
		opacity: 0.7;
		font-weight: 200;
		margin-bottom: 0;
		font-size: 13px;
		margin-bottom: 8px;
		margin-top: 8px;
	}
</style>
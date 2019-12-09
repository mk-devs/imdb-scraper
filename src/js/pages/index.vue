<template>
	<section class="page">
		<span>
			<div class="card">
				<div style="background-image: url(http://www.trendycovers.com/covers/walter_white_breaking_bad_facebook_cover_1407231074.jpg);height: 120px;background-size: cover;background-position: 0px -13px;"></div>				
				<div class="card-body" :class="{'loading': loading}">
					<template v-if="!ready">
						<h3 class="text-center mb-3">Movie Recommendation</h3>
						<label class="mt-1 mb-3">Select Your favorite Categroy:</label>

						<div class="error" v-if="error">Please Select Category</div>
						<select class="form-control" v-model="categroy">
							<option disabled="" :value="null">Select Category</option>
							<option value="drama">Drama</option>
							<option value="action">Action</option>
							<option value="comedy">Comedy</option>
							<option class="fantast">Fantasy</option>
							<option class="war">War</option>
							<option class="romance">Romance</option>
							<option class="adventure">Adventure</option>
						</select>

						<div class="text-right mt-auto">
							<button class="btn btn-success" @click="submit">Submit</button>
						</div>
					</template>
					<template v-else>
						<div class="d-flex">
							<span>
								<img class="movie-img" :src="movie.image">
							</span>
							<span>
								<h5 class="title">{{ movie.title }}</h5>
								<p class="meta text-muted">{{ movie.genre }} | {{ movie.rating }}/10 | {{ movie.runtime }}</p>
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
				error: false,
				movie: {
					image: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_UY98_CR1,0,67,98_AL_.jpg",
					link: "/title/tt0068646/?ref_=adv_li_i",
					title: "The Godfather",
					rating: "9.2",
					runtime: "175 min",
					genre: "Crime, Drama",
					desc: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
				},
				categroy: null,
				ready: false,				
				loading: false
			}
		},
		methods: {
			submit: function () {
    			let _this = this;
    			if(!_this.categroy) {
    				_this.error = true;
    				return false;
    			}

    			_this.loading = true;
    			this.$http.get('/scrape/' + _this.categroy).then((res) => {
    				let data = res.data.data;
    				// console.log(data)
    				_this.movie = {
						image: data.image.replace(/(@)(.*)(_.)/, '@.'),
						link: "https://www.imdb.com"+data.link,
						title: data.title,
						rating: data.rating,
						runtime: data.runtime,
						genre: data.genre,
						desc: data.desc
    				}
    				_this.ready = true;
    				_this.loading = false
    			}).catch((error) => {
    				_this.loading = false;
					console.log(error)
				})
			}
		},
		watch: {
			'categroy': function (value) {
				this.error = false;
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
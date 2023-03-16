module.exports = {
	port: '8249',
	locales: {
		'/': {
			lang: 'zh-CN',
			title: '开发手册',
			description: '记录开发过程解决问题的经验'
		}
	},
	theme: '@vuepress/theme-blog',
	themeConfig: {
		locales: {
			'/': {}
		}
	},
	plugins: [
		['@vuepress/blog', {
			directories: [
				{
					id: 'post',
					dirname: '_posts',
					path: '/',
					pagination: {
						lengthPerPage: 20,
					},
				}
			],
			frontmatters: [
				{
					id: 'tag',
					keys: ['tags'],
					path: '/tag/',
					layout: 'Tag',
				},
			],
		}], 
		'@vuepress/back-to-top', 
		'@vuepress/nprogress',
		'@vuepress-reco/extract-code'
	]
}

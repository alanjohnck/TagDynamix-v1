/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://tagdynamix.com', // ✅ Replace with your actual domain
  generateRobotsTxt: true,            // Automatically generate robots.txt
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin', '/api/*'],      // Optional: exclude routes
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      }
    ]
  }
}

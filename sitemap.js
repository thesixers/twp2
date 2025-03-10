import { SitemapStream, streamToPromise } from 'sitemap'
import { createWriteStream } from 'fs'

async function generateSitemap() {
    const links = [
        { url: '/twp/home', changefreq: 'always', priority: 1.0 },
        { url: '/twp/webtoon', changefreq: 'daily', priority: 0.8 },
        { url: '/twp/webtoon?type=twporiginal', changefreq: 'daily', priority: 0.8 },
        { url: '/twp/aboutus', changefreq: 'monthly', priority: 0.6 },
        { url: '/twp/webtoon/episodes', changefreq: 'daily', priority: 0.7 },
        { url: '/twp/auth/signup', changefreq: 'monthly', priority: 0.5 },
        { url: '/twp/auth/login', changefreq: 'monthly', priority: 0.5 },
    ];

    const sitemapStream = new SitemapStream({ hostname: 'https://thewebtoonproject.com' });

    const writeStream = createWriteStream('./public/sitemap.xml');
    sitemapStream.pipe(writeStream);

    links.forEach(link => sitemapStream.write(link));
    sitemapStream.end();

    await streamToPromise(sitemapStream); // Wait for the stream to finish
    console.log('Sitemap generated!');
}

generateSitemap();

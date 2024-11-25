// api/fetch.js
const express = require('express')
const router = express.Router()

// Helper function to fetch URL content
const fetchContent = async (url) => {
  const response = await fetch(url)
  return response.text()
}

// Helper function to extract URLs with improved attribute handling
const extractUrls = (content, baseUrl) => {
  const urls = {}
  let count = 0
  const regex =
    /<a[^>]*href="([^"]*)"[^>]*(?:title="([^"]*)")?[^>]*(?:alt="([^"]*)")?[^>]*>/g
  let match

  while ((match = regex.exec(content)) !== null) {
    count++
    const [_, href, title, alt] = match

    // Convert relative URL to absolute
    let absoluteUrl = href
    try {
      absoluteUrl = new URL(href, baseUrl).href
    } catch (e) {
      // Keep original URL if conversion fails
    }

    urls[count] = {
      hrefName: title || `Link ${count}`,
      hrefLink: absoluteUrl,
      hrefAlt: alt || `Link ${count}`,
    }
  }

  return urls
}

// Helper function to extract images
const extractImages = (content, baseUrl) => {
  const images = {}
  let count = 0
  const regex =
    /<img[^>]*src="([^"]*)"[^>]*(?:title="([^"]*)")?[^>]*(?:alt="([^"]*)")?[^>]*>/g
  let match

  while ((match = regex.exec(content)) !== null) {
    count++
    const [_, src, title, alt] = match

    // Convert relative URL to absolute
    let absoluteUrl = src
    try {
      absoluteUrl = new URL(src, baseUrl).href
    } catch (e) {
      // Keep original URL if conversion fails
    }

    images[count] = {
      imageName: title || `Image ${count}`,
      imageLink: absoluteUrl,
      imageAlt: alt || `Image ${count}`,
    }
  }

  return images
}

// Helper function to extract metadata
const extractMetadata = (content) => {
  const metadata = {
    title: '',
    description: '',
    keywords: '',
  }

  const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/)
  if (titleMatch) metadata.title = titleMatch[1]

  const descMatch = content.match(
    /<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/
  )
  if (descMatch) metadata.description = descMatch[1]

  const keywordsMatch = content.match(
    /<meta[^>]*name="keywords"[^>]*content="([^"]*)"[^>]*>/
  )
  if (keywordsMatch) metadata.keywords = keywordsMatch[1]

  return metadata
}

// Helper function to extract social meta tags
const extractSocialMeta = (content) => {
  const social = {
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: '',
  }

  const ogTitleMatch = content.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"[^>]*>/
  )
  if (ogTitleMatch) social.ogTitle = ogTitleMatch[1]

  const ogDescMatch = content.match(
    /<meta[^>]*property="og:description"[^>]*content="([^"]*)"[^>]*>/
  )
  if (ogDescMatch) social.ogDescription = ogDescMatch[1]

  const ogImageMatch = content.match(
    /<meta[^>]*property="og:image"[^>]*content="([^"]*)"[^>]*>/
  )
  if (ogImageMatch) social.ogImage = ogImageMatch[1]

  const twitterCardMatch = content.match(
    /<meta[^>]*name="twitter:card"[^>]*content="([^"]*)"[^>]*>/
  )
  if (twitterCardMatch) social.twitterCard = twitterCardMatch[1]

  return social
}

// Main route to get all data
router.get('/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    const content = await fetchContent(url)

    res.json({
      URL: extractUrls(content, url),
      image: extractImages(content, url),
      metadata: extractMetadata(content),
      social: extractSocialMeta(content),
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URL content' })
  }
})

// Route for URLs only
router.get('/url/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    const content = await fetchContent(url)
    res.json({ URL: extractUrls(content, url) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch URLs' })
  }
})

// Route for images only
router.get('/image/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    const content = await fetchContent(url)
    res.json({ image: extractImages(content, url) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch images' })
  }
})

// Route for metadata only
router.get('/metadata/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    const content = await fetchContent(url)
    res.json({ metadata: extractMetadata(content) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metadata' })
  }
})

// Route for social data only
router.get('/social/:url', async (req, res) => {
  try {
    const url = decodeURIComponent(req.params.url)
    const content = await fetchContent(url)
    res.json({ social: extractSocialMeta(content) })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch social data' })
  }
})

module.exports = router

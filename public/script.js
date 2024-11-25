const themes = {
  modern: {
    primary: 'purple',
    gradient: 'linear-gradient(135deg, #1e1e1e 0%, #3a3a3a 100%)', // Dark gradient
    textColor: 'text-black', // White text for contrast
  },
  ocean: {
    primary: 'blue',
    gradient: 'linear-gradient(135deg, #0f4b6e 0%, #1f7a8c 100%)', // Dark ocean gradient
    textColor: 'text-black', // White text for contrast
  },
  forest: {
    primary: 'green',
    gradient: 'linear-gradient(135deg, #0a2a2a 0%, #4a7c7c 100%)', // Dark forest gradient
    textColor: 'text-black', // White text for contrast
  },
  sunset: {
    primary: 'orange',
    gradient: 'linear-gradient(135deg, #3b0a45 0%, #5c258d 100%)', // Dark sunset gradient
    textColor: 'text-black', // White text for contrast
  },
}

// Style the selected data type card
document.querySelectorAll('input[name="dataType"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    document.querySelectorAll('.data-type-card').forEach((card) => {
      card.classList.remove('border-purple-500', 'bg-purple-50')
    })
    e.target.parentElement
      .querySelector('.data-type-card')
      .classList.add('border-purple-500', 'bg-purple-50')
  })
})

// Initialize first data type card as selected
document
  .querySelector('.data-type-card')
  .classList.add('border-purple-500', 'bg-purple-50')

function changeTheme(themeName) {
  const theme = themes[themeName]
  document.querySelector('.gradient-bg').style.background = theme.gradient
  document.body.className = theme.textColor // Apply text color globally
  localStorage.setItem('theme', themeName) // Save the selected theme
}

async function scrapeUrl() {
  const urlInput = document.getElementById('urlInput')
  const dataType = document.querySelector('input[name="dataType"]:checked')
  const resultElement = document.getElementById('result')
  const scrapeButton = document.getElementById('scrapeButton')

  if (!urlInput.value) {
    showNotification('Please enter a URL', 'error')
    return
  }

  try {
    scrapeButton.disabled = true
    scrapeButton.innerHTML = `<span class="flex items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Scraping...
                </span>`
    resultElement.textContent = 'Loading...'

    const encodedUrl = encodeURIComponent(urlInput.value)
    const endpoint = `/api/fetch/${dataType.value === 'all' ? '' : dataType.value + '/'}${encodedUrl}`

    const response = await fetch(endpoint)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    resultElement.textContent = JSON.stringify(data, null, 2)
    showNotification('Data scraped successfully!', 'success')
  } catch (error) {
    resultElement.textContent = `Error: ${error.message}`
    showNotification('Failed to fetch data', 'error')
  } finally {
    scrapeButton.disabled = false
    scrapeButton.textContent = 'Scrape Data'
  }
}

function showNotification(message, type) {
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg text-white font-medium transform transition-all duration-300 ${type === 'error' ? 'bg-red-500' : 'bg-green-500'}`
  notification.textContent = message
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.opacity = '0'
    notification.style.transform = 'translateY(-100%)'
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

function copyResults() {
  const resultText = document.getElementById('result').textContent
  navigator.clipboard
    .writeText(resultText)
    .then(() => showNotification('Results copied to clipboard!', 'success'))
    .catch(() => showNotification('Failed to copy results', 'error'))
}

// Add enter key support
document.getElementById('urlInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    scrapeUrl()
  }
})

// Initialize theme from localStorage when the page loads
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'modern'
  changeTheme(savedTheme)
  document.getElementById('themeSelect').value = savedTheme
})

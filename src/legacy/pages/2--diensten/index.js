/**
 * Initialize the Diensten page
 */
export function initDiensten() {
  console.log('Diensten page initialized')

  // Your Diensten page specific code here
  const dienstenElements = document.querySelectorAll('.dienst-item')

  if (dienstenElements.length) {
    dienstenElements.forEach((element, index) => {
      // Add animation delay based on index
      element.style.transitionDelay = `${index * 0.1}s`

      // Example: Add hover effect
      element.addEventListener('mouseenter', () => {
        element.style.transform = 'scale(1.05)'
        element.style.transition = 'transform 0.3s ease'
      })

      element.addEventListener('mouseleave', () => {
        element.style.transform = 'scale(1)'
      })
    })
  }
}

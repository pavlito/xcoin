window.iprNavbar = (function ($) {
  let size, config
  let expanded = false

  function syncSize($nav) {
    if(!config) {
      config = {size: "50vw", responsive: []}
    }

    let winWidth = $(window).width()
    let defaultSize = config.size

    let calculatedSize = null
    config.responsive.forEach(opts => {
      if(!calculatedSize && winWidth <= opts.breakpoint) {
        calculatedSize = opts.size
      }
    })

    if(!calculatedSize) {
      calculatedSize = defaultSize
    }

    $nav.find('.ipr-nav-content').css('minWidth', calculatedSize)
    if(expanded) {
      $nav.css('width', calculatedSize)
    }
    size = calculatedSize
  }

  $(document).ready(function() {
    $nav = $('.ipr-site-mobile-navigation')
    $hide = $(".ipr-nav-hide")

    syncSize($nav)
    $(window).resize(function() {
      syncSize($nav)
    })

    $('.ipr-nav-toggle').click(function() {
      expanded = true
      $hide.show()
      $('body').addClass('ipr-overlay')
      $('html').css('overflow', 'hidden')
      $nav.css('width', size)
    })

    $hide.click(function() {
      expanded = false
      $hide.hide()
      $('body').removeClass('ipr-overlay')
      $('html').css('overflow', 'visible')
      $nav.css('width', 0)
    })
  })

  function setConfig(_size, _config) {
    size = _size
    config = _config
  }

  return {
    setConfig: setConfig
  }
})(jQuery)
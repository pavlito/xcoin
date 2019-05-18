"use strict";

(function ($) {
  function template() {
    var $t = $(`
      <div class='fill'>
        <div class='fill-border'></div>
        <div class='fill-green'></div>
        <div class='fill-red'></div>
      </div>
    `)

    return $t
  }

  $.fn.iprProgress = function() {
    $(this).each(function() {
      var progress = $(this)
      var fillGreen = progress.find('.ipr-green').data('filling')
      var fillRed   = progress.find('.ipr-red').data('filling')

      var $t = template()
      
      $t.find('.fill-green').css({
        width: fillGreen + "%"
      })

      $t.find('.fill-red').css({
        width: fillRed + "%"
      })

      progress.find('.bar').append($t)
    })
  }
})(jQuery)
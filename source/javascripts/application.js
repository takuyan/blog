(function () {
  'use strict';
  var toggle = document.querySelector('.navbar-toggle');
  var navigation = document.getElementById('site-navigation');
  if (toggle && navigation) {
    toggle.addEventListener('click', function () {
      var expanded = navigation.classList.toggle('in');
      toggle.setAttribute('aria-expanded', String(expanded));
    });
  }

  // Keep the legacy URL suggestion without inserting URL-derived HTML.
  var suggestion = document.getElementById('suggest');
  if (suggestion) {
    var path = window.location.pathname;
    if (path.indexOf('/blog/') === 0) {
      suggestion.querySelector('a').setAttribute('href', path.replace('/blog/', '/posts/'));
      var heading = document.querySelector('.logo_area h1');
      if (heading) {
        heading.textContent = '301';
        var detail = document.createElement('small');
        detail.textContent = 'Moved Permanently';
        heading.appendChild(detail);
      }
    } else {
      suggestion.parentNode.removeChild(suggestion);
    }
  }
}());

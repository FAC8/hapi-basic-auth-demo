document.getElementById('student-login').addEventListener('click', makeGetRequest('/student'));
document.getElementById('teacher-login').addEventListener('click', makeGetRequest('/teacher'));
const backButtons = document.getElementsByClassName('back-button');
backButtons.forEach(function(element){
  element.addEventListener('click', makeGetRequest('/'));
});

function makeGetRequest(endpoint) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', endpoint, true);
  xhr.setRequestHeader('Content-Type', 'text/html');
  xhr.send();
}

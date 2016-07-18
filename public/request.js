document.getElementById('student-login').addEventListener('click', goToStudentPage);
document.getElementById('teacher-login').addEventListener('click', goToTeacherPage);
const backButtons = document.getElementsByClassName('back-button');
backButtons.forEach(function(element){
  element.addEventListener('click', backToHomepage);
});

function goToStudentPage() {
  makeXhrRequest('GET', '/student', 'text/html');
}

function goToTeacherPage() {
  makeXhrRequest('GET', '/teacher', 'text/html');
}

function backToHomepage() {
  makeXhrRequest('GET', '/', 'text/html');
}

function makeXhrRequest(method, endpoint, contentType) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, endpoint, true);
  xhr.setRequestHeader('Content-Type', contentType);
  xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  // SendMail submit event handler
  document.querySelector('#compose-form').addEventListener('submit', sendMail);
}


function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';
  document.querySelector('#emails-view').innerHTML = '';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      emails.forEach(oneemail => {
        console.log(oneemail);
        const singleEmail = document.createElement('div');
        singleEmail.addEventListener('click', () => openSingle(oneemail, mailbox));
        if (oneemail.read == false) {
          singleEmail.innerHTML = `<p style="border: solid;">From: ${oneemail.sender} Subject: ${oneemail.subject} at: ${oneemail.timestamp}</p>`;
        } else{
          singleEmail.innerHTML = `<p style="border: solid; background-color: gray;">From: ${oneemail.sender} Subject: ${oneemail.subject} at: ${oneemail.timestamp}</p>`;
        }
        document.querySelector('#emails-view').appendChild(singleEmail);
      });
  });
  document.querySelector('#emails-view').style.display = 'block';
}


function sendMail(event){
  event.preventDefault();
  let recipient = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value;
  let body = document.querySelector('#compose-body').value;
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}


function openSingle(email, mailbox){
  console.log(mailbox);
  console.log(email);
  console.log(email.id);
  if (email.read === false){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
  }
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'block';

  document.querySelector('#single-from').innerHTML = email.sender;
  document.querySelector('#single-to').innerHTML = email.recipients;
  document.querySelector('#single-subject').innerHTML = email.subject;
  document.querySelector('#single-time').innerHTML = email.timestamp;
  document.querySelector('#single-body').innerHTML = email.body;

  if (mailbox === 'inbox'){
    document.querySelector('#addArchive').style.display = 'block';
    document.querySelector('#removeArchive').style.display = 'none';
  } else if (mailbox === 'archive'){
    document.querySelector('#addArchive').style.display = 'none';
    document.querySelector('#removeArchive').style.display = 'block';
  } else if (mailbox === 'sent'){
    document.querySelector('#addArchive').style.display = 'none';
    document.querySelector('#removeArchive').style.display = 'none';
  }
  // archiving$unarchiving
  document.querySelector('#addArchive').addEventListener('click', () => addArchive(email));
  document.querySelector('#removeArchive').addEventListener('click', () => removeArchive(email));
}


function addArchive(email){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(() => {
    // Print result
    load_mailbox('inbox');
});  
}


function removeArchive(email){
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(() => {
    // Print result
    load_mailbox('inbox');
});
}
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
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      // ... do something else with emails ...
      emails.forEach(email => {
        const singleEmail = document.createElement('div');
        if (email.read == false) {
          singleEmail.innerHTML = `<p style="border: solid;">From: ${email.sender} Subject: ${email.subject} at: ${email.timestamp}</p>`;
        } else {
          singleEmail.innerHTML = `<p style="border: solid; background-color: gray;">From: ${email.sender} Subject: ${email.subject} at: ${email.timestamp}</p>`;
        }
        document.querySelector('#emails-view').append(singleEmail);
        singleEmail.addEventListener('click', () => openSingle(email.id, mailbox));
      });
  });
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


function openSingle(id, mailbox){
  console.log(mailbox);
  console.log(id);
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'block';

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);
      // ... do something else with email ...
      document.querySelector('#single-from').innerHTML = email.sender;
      document.querySelector('#single-to').innerHTML = email.recipients;
      document.querySelector('#single-subject').innerHTML = email.subject;
      document.querySelector('#single-time').innerHTML = email.timestamp;
      document.querySelector('#single-body').innerHTML = email.body;
  });
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
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
  document.querySelector('#addArchive').addEventListener('click', () => addArchive(id));
  document.querySelector('#removeArchive').addEventListener('click', () => removeArchive(id));
}


function addArchive(id){
  console.log(id);
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(result => {
    // Print result
    console.log(result);
    load_mailbox('inbox');
});  
}

function removeArchive(id){
  console.log(id);
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(result => {
    // Print result
    console.log(result);
    load_mailbox('inbox');
});
}
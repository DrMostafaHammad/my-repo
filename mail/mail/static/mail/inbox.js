document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#addArchive').addEventListener('click', () => addArchive());
  document.querySelector('#removeArchive').addEventListener('click', () => removeArchive());
  // By default, load the inbox
  load_mailbox('inbox');
});


function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
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
  document.querySelector('#emails-view').innerHTML = '';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    emails.forEach(oneemail => {
      const singleEmail = document.createElement('div');
      if (oneemail.read == false) {
        singleEmail.innerHTML = `<p style="border: solid;">From: ${oneemail.sender} Subject: ${oneemail.subject} at: ${oneemail.timestamp}</p>`;
      } else{
        singleEmail.innerHTML = `<p style="border: solid; background-color: gray;">From: ${oneemail.sender} Subject: ${oneemail.subject} at: ${oneemail.timestamp}</p>`;
      }
      document.querySelector('#emails-view').appendChild(singleEmail);
      singleEmail.addEventListener('click', () => openSingle(oneemail, mailbox));
    });
  });
  console.log(`${mailbox} loaded`);
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
  if (email.read === false){
    fetch(`/emails/${email.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })
  }
  const id = email.id;
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'block';
  document.querySelector('#reply-view').style.display = 'none';

  document.querySelector('#single-from').innerHTML = email.sender;
  document.querySelector('#single-to').innerHTML = email.recipients;
  document.querySelector('#single-subject').innerHTML = email.subject;
  document.querySelector('#single-time').innerHTML = email.timestamp;
  document.querySelector('#single-body').innerHTML = email.body;

  if (mailbox === 'inbox'){
    document.querySelector('#addArchive').style.display = 'block';
    document.querySelector('#removeArchive').style.display = 'none';
    document.querySelector('#replybutton').style.display = 'block';
  } else if (mailbox === 'archive'){
    document.querySelector('#addArchive').style.display = 'none';
    document.querySelector('#removeArchive').style.display = 'block';
    document.querySelector('#replybutton').style.display = 'block';
  } else if (mailbox === 'sent'){
    document.querySelector('#addArchive').style.display = 'none';
    document.querySelector('#removeArchive').style.display = 'none';
    document.querySelector('#replybutton').style.display = 'none';
  }
  // archiving$unarchiving
  document.querySelector('#replybutton').addEventListener('click', () => reply(email));
  document.querySelector('#addArchive').setAttribute("email_id", id);
  document.querySelector('#removeArchive').setAttribute("email_id", id);
  return console.log('opened single');
}


function addArchive(){
  const id = document.querySelector('#addArchive').getAttribute('email_id');
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: true
    })
  })
  .then(() => {
    // Print result
    load_mailbox('inbox');
  });
  return console.log('archived');
}


function removeArchive(){
  const id = document.querySelector('#removeArchive').getAttribute('email_id');
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        archived: false
    })
  })
  .then(() => {
    // Print result
    load_mailbox('inbox');
  });
  return console.log('unarchived');
}


function reply(email){
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';
  document.querySelector('#reply-view').style.display = 'block';
  var subjectPrefix = "Re: ";
  var subject = email.subject;
  subject = subject.trim();
  console.log(subject.substring(0,4));
  if (subject.substring(0, 4) === subjectPrefix){
    subject = subject.substring(4);
    console.log('trimming',subject);
  }
  subject = subjectPrefix+subject;
  // Populate reply fields fields
  document.querySelector('#reply-recipients').value = email.sender;
  document.querySelector('#reply-subject').value = subject;
  console.log(subject);
  document.querySelector('#reply-body').value = `\n On ${email.timestamp}\n ${email.sender} wrote:\n${email.body}`;
  // SendMail submit event handler
  document.querySelector('#reply-form').addEventListener('submit', sendReply);
}


function sendReply(event){
  event.preventDefault();
  let recipient = document.querySelector('#reply-recipients').value;
  let subject = document.querySelector('#reply-subject').value;
  let body = document.querySelector('#reply-body').value;
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
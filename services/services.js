class Services {
  constructor(options){
    this.options = options;
    this.errorMessage = 'Kindly check your input.';
    this.loader = document.querySelector(".loader");
    this.successMsg = document.querySelector(".form");
    this.errorMsg = document.querySelector(".error-message")
  };
  
  isFieldDataValid(){
    // If any one of the field contains invalid data, Reject the entire form.
    this.invalidData = []
    Object.keys(this.options).forEach((options) => {
      if(!this.options[options].validation.test(this.options[options].value)){
        this.invalidData.push(options);
      } else {
        delete this.options[options].validation;
        this.options[options] = this.options[options].value;
      }
    });
    return this.invalidData;
  };
  
  _toggleLoader(value){
    if(value){
      // Trigger the loader if passed value is true.
      this.loader.style.display = "flex";
    } else {
      // Destroy the laoder is its false.
      this.loader.style.display = "none";
    }
  };
  
  // Throw error indication for the invalid fields only!
  _errorIndication(options){
    this.errorMsg.style.display = "block";
    this.errorMsg.innerHTML = options.message;
  };
  
  _successNotify(){
    this.successMsg.innerHTML = `<p class="successMsg">"Your request submitted successfully"</p>`;
  };

  _sendMessage(){
    return fetch('https://salman-dev--guileless-sundae-522a29.netlify.app/.netlify/functions/server/send-messages', {
      method: 'POST',
      body: JSON.stringify(this.options),
      headers: {
         "Content-type": "application/json; charset=UTF-8"
      }
    }).then(res => res.json())
      .catch(err => err);
  };
  
  sendMessage(){
    // Trigger the loader on click.
    this._toggleLoader(true);
    // Valid the field data's are correct.
    this.isFieldDataValid();
    if(this.invalidData.length === 0){
      this._sendMessage().then((result) => {
        if(result.status){
          this._toggleLoader(false);
          this._successNotify();
        }
      }).catch((err) => {
        this._errorIndication({message: 'Internal error occurred. Please try again later.'})
      })
    } else {
      this._toggleLoader(false);
      // Show error indication.
      this._errorIndication({message: 'Please check your input'});
    }
  };
  
}

function _getAllFieldData(){
  return {
    name: {
      value: document.getElementById("name").value,
      validation: /^[A-Za-z ]+$/
    },
    mobile: {
      value: document.getElementById("mobile").value,
      validation: /^\d{10}$/
    },
    email: {
      value: document.getElementById("email").value,
      validation: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    message: {
      value: document.getElementById("message").value,
      validation:  /^[A-Za-z ]+$/
    }
  };
};

function handleSendMessage(event){
  event.preventDefault();
  var fieldData = _getAllFieldData();
  var servicesInstance = new Services(fieldData);
  servicesInstance.sendMessage();
}

const sendMessage = document.getElementById('sendMessageBtn');
sendMessage.addEventListener('click', handleSendMessage);



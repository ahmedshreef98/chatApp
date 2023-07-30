const socket =io()                                               // socket cotian the return value from function IO 

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');



socket. on('message', (message) =>{
    console.log(message);
})
 

$messageForm.addEventListener('submit',(e)=>{ 
     e.preventDefault()
     $messageFormButton.setAttribute('disabled', 'disabled')     //disable form Button once it submitted
     
     // const message= document.querySelector('input').value
      const message= e.target.elements.message.value               // Better to avoid errors occured if there are multiple inputs in form  

socket.emit('sendMessage',message ,(error)=>{
    $messageFormButton.removeAttribute('disabled')                 //enable form Button once it submitted    
    $messageFormInput .value=''                                    // Reset the value of the input field
    $messageFormInput.focus( )                                     // Move cursor to the input field

    if(error){
        return console.log(error)
    }
    console.log('Message was delivered');
})

})


document.querySelector('#send-location').addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported')
    }

    $locationButton.setAttribute('disabled', 'disabled')      //disable Location Button untill location sent 

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            latitude:position .coords.latitude,
            longitude:position.coords.longitude },(error)=>{            
                if(error){
                    return console.log(error)
                }
                $locationButton.removeAttribute('disabled')      //enable Location Button once it sent 
                console.log('Location was shared  ');

            })
    })
    



})


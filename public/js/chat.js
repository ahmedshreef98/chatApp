
 const socket =io()                                       // socket cotian the return value from function IO 


//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

//Templates
const messageTemplate=document.querySelector('#message-template').innerHTML
const locationTemplate=document.querySelector('#location-template').innerHTML
const sidebartemplate=document.querySelector('#sidebar-template').innerHTML


//Options 
const { username, room }=Qs.parse(location.search, { ignoreQueryPrefix: true })    //Qs for parse query String values

//Rendering Messages 
socket. on('message', (message) =>{     
    console.log(message);
    const html =Mustache.render(messageTemplate,{
        username: message.username,
         message:message.text, 
         createdAt:moment(message.createdAt).format('h:mm A')})   

    $messages.insertAdjacentHTML('beforeend', html)
})

//Rendering Location
socket.on('locationMessage',(locationMessage)=>{
   console.log(locationMessage);
   const html =Mustache.render(locationTemplate,{ 
       username:locationMessage.username,
       url:locationMessage.url,
       createdAt:moment(locationMessage.createdAt).format('h:mm A') })         
   
   $messages.insertAdjacentHTML('beforeend', html) 
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
                console.log('Location was shared');

            })
    })
    



})


socket.emit('join', { username, room },(error)=>{          
 // Event Acknowledment
  console.log(error);
  if (error){
    alert(error);
    location.href='/'
  }
} ) 

socket.on('roomData', ({ room, users}) => {
      const html=Mustache.render(sidebartemplate, {
        room, users      })
        document.querySelector('#sidebar').innerHTML =html

     
})
 

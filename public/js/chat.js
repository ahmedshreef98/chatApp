
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
 
const autoScroll = () =>{
       // New Message
      const $newmessage =$messages.lastElementChild                           // assgin the last new message
      
      // Get the height of the new message
      const newMessageStyles = getComputedStyle( $newmessage)                //returns object of all the CSS properties of the new message
      const newMessageMargin = parseInt(newMessageStyles.marginBottom)       //converting the marginBottom property from the computed styles into an integer
      const newMessageHeight = $newmessage.offsetHeight + newMessageMargin   //calculates and stores the combined height of the new message element, considering both its content and any bottom margin that should be accounted for in layout 
      
      // Get The Visable height 
      const visibleHeight =$messages.offsetHeight 
 
      // Get the Height of messages Container
      const containerHeight = $messages.scrollHeight                         //  calculating the total scrollable height of an HTML element 'messages'

      //The height we scrolled !!
      const scrollOffset = $messages.scrollTop + visibleHeight               // calculating the total distance from the top of all messages to the bottom of the messages

      if(containerHeight - newMessageHeight <= scrollOffset){
          $messages.scrollTop=$messages.scrollHeight
      }
       
}

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
    autoScroll()
})

//Rendering Location
socket.on('locationMessage',(locationMessage)=>{
   console.log(locationMessage);
   const html =Mustache.render(locationTemplate,{ 
       username:locationMessage.username,
       url:locationMessage.url,
       createdAt:moment(locationMessage.createdAt).format('h:mm A') })         
   
   $messages.insertAdjacentHTML('beforeend', html) 
   autoScroll()
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
 

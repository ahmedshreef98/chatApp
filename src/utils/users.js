const users =[]

//addUser 
const addUser=({id, username, room})=>{
    //Clean the data 
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return{
            error:"UserName and Room are required"
        }
    }

    //check if existing user
    const existingUser=users.find((user)=>{
        return user.room===room && user.username===username
    })

    //Validate userName
    if(existingUser){
        return{
            error: 'This UserName is already Exsit'
        }
    }

    //Store User 
    const user ={id , username, room}
    users.push(user)
    return {user}
}


 //Remove User
 const removeUser=(id)=>{
    const index =users.findIndex((user)=>user.id===id)
    if(index !== -1){
        return users.splice(index,1)[0]
    }
}


//getUser
const getUser = (id) => {
    return users.find((user) => user.id === id)
}


//getUsersInRoom
const getUsersInRoom=(room)=> {
    room = room.trim().toLowerCase();
    return users.filter((user)=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUsersInRoom

}
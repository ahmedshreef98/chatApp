const generateMessage= (text)=>{
    return{
        text,
        createdAt: (new Date).getTime(),             // catch timestamp
    }
}

const generateLocationMessage= (url)=>{
    return{
        url,
        createdAt: (new Date).getTime(),             // catch timestamp
    }
}



module.exports={
    generateMessage,
    generateLocationMessage
}

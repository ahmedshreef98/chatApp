const generateMessage= ( username, text) => {
    return{
        username,
        text,
        createdAt: (new Date).getTime(),             // catch timestamp
    }
}

const generateLocationMessage= ( username, url ) => {
    return{
        username,
        url,
        createdAt: (new Date).getTime(),             // catch timestamp
    }
}



module.exports={
    generateMessage,
    generateLocationMessage
}

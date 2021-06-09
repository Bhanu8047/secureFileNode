const messageBox = $('#messageBox')
const message = $('#message')
const deleteAll = $('#deleteAll')
deleteAll.click((e)=>{
    e.preventDefault()
    fetch('/deleteAllFiles',{
        method: 'DELETE'
    })
    .then(res=>res.json())
    .then(res => {
        message.text(res.message)
        messageBox.addClass('animBoxIn')
        setTimeout(()=>{
            messageBox.removeClass('animBoxIn')
            messageBox.addClass('animBoxOut')
        },3000)
        messageBox.removeClass('animBoxOut')
    })
    .catch(err=>{
        console.error(err)
    })
})


const messageBox = $('#messageBox')
const message = $('#message')
const deleteAll = $('#deleteAll')


window.addEventListener('load', async()=>{
    fetchFiles()
})


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
        fetchFiles()
    })
    .catch(err=>{
        console.error(err)
    })
})

const logout = $('#logout')
logout.click((e)=>{
    e.preventDefault()
    fetch('/logout',{
        method: 'POST'
    })
    .then(res=> res.json())
    .then(res=> {
        if(!res.success){
            message.text(res.message)
            messageBox.addClass('animBoxIn')
            setTimeout(()=>{
                messageBox.removeClass('animBoxIn')
                messageBox.addClass('animBoxOut')
            },3000)
            messageBox.removeClass('animBoxOut')
        } else {
            message.text(res.message)
            messageBox.addClass('animBoxIn')
            setTimeout(()=>{
                messageBox.removeClass('animBoxIn')
                messageBox.addClass('animBoxOut')
                location.href = '/login'
            },3000)
            messageBox.removeClass('animBoxOut')
        }
    })
    .catch(err=>{
        console.error(err)
    })
})

function fetchFiles() {
    fetch('/files', {
        method: 'GET'
    })
    .then(res=>res.json())
    .then(res => {
        if(res.success && res.files.length > 0){
            fileTemplate(res.files)
        } else {
            $('#filesReload').html(`
                <h2> looks a bit empty here </h2>
            `)
        }
    })
    .catch(err=>{
        console.error(err)
    })
}

function fileTemplate (files) {
    const filesR = document.querySelector('#filesReload')
    let Data = ``
    files.forEach(file => {
        Data += `
        <div data-id="${file._id}" class="file">
            <p class="file__filename">
                <strong>Filename::</strong>
                <a class="link" href="/downloadFile/${file._id}">
                    ${file.filename}
                </a>
            </p>
            <p class="file__date">
                <strong>Added on::</strong> 
                ${file.createdAt}
            </p>
            <div class="controller">
                <a class="btn btn-download" href="/downloadFile/${file._id}">download</a>
                <a class="btn btn-delete" href="/deleteFile/${file._id}">delete</a>
            </div>
        </div>
        `
    })
    filesR.innerHTML = Data
}
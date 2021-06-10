const message = document.querySelector('#message')
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("#fileinput");
let file; 
button.onclick = ()=>{
  input.click();
}
input.addEventListener("change", function(){
  file = this.files[0];
  dropArea.classList.add("active");
  message.textContent = ''
  uploadFile()
});

dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); 
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); 
  
  file = event.dataTransfer.files[0];
  uploadFile()
});

function uploadFile() {
    const formData = new FormData()
    formData.append('filetoupload', file)
    fetch('/addFile', {
        method: "POST",
        headers: {
            'Content_Type': 'multipart/form-data'
        },
        body: formData
    }).then(res=> res.json())
    .then(res=>{
        message.textContent = res.message
        setTimeout(()=>{
          message.textContent = ''
        },2000)
    })
}
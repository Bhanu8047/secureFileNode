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
  showFile();
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
  showFile();
});

function showFile(){
  let fileType = file.type; 
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; 
  if(validExtensions.includes(fileType)){ 
    let fileReader = new FileReader(); 
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; 
        
       let imgTag = `<img src="${fileURL}" alt="image">`; 
      dropArea.innerHTML = imgTag; 
    }
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
    dragText.textContent = "Drag & Drop to Upload File";
  }
  uploadFile()
}

function uploadFile() {
    const selectValue = document.querySelector('#select').value
    const formData = new FormData()
    formData.append('filetoupload', file)
    formData.append('filename', selectValue)
    fetch('/addFile', {
        method: "POST",
        headers: {
            'Content_Type': 'multipart/form-data'
        },
        body: formData
    }).then(res=> res.json())
    .then(res=>{
        const message = document.querySelector('#message')
        message.style.color = '#fff'
        message.textContent = res.message
        setTimeout(()=>{
            location.href = '/'
        },3000)
    })
}
const loginBar = $('#loginBar')
const signupBar = $('#signupBar')
loginBar.click(()=>{
    const form = $('#form')
    form.submit(()=>{
        
    })
    // console.log('boombaam')
    //     loginBar.addClass('loginAnim')
    //     $('.spinner').fadeIn(800)
    //     $('.spinner').addClass('loadAnim')
})
const signupForm = $('#signupForm')
signupForm.submit((e)=>{
    e.preventDefault()
    $('#errorMessage').text('')
    const formData = new FormData(document.querySelector('#signupForm'))
    const body = {
        username: formData.get('username'),
        email: formData.get('email'),
        name: formData.get('fullname'),
        password: formData.get('password'),
    }
    if($('#confirmPassword').val() !== body.password){
        $('#errorMessage').text('password does not match.')
        signupBar.addClass('loginAnim')
        $('.spinner').fadeIn(800)
        $('.spinner').addClass('loadAnim')
        setTimeout(()=>{
            $('.spinner').removeClass('loadAnim')
            $('.spinner').fadeOut(100)
            signupBar.removeClass('loginAnim')
            $('#errorMessage').text('')
        },2000)
    } else {
        signupBar.addClass('loginAnim')
        $('.spinner').fadeIn(800)
        $('.spinner').addClass('loadAnim')
        fetch('/addNewUser',{
            method: 'POST',
            headers:{
              "Content-type":"application/json"   
            },
            body: JSON.stringify(body)
        })
        .then(res=>res.json())
        .then(res=>{
            if(!res.success){
                signupBar.removeClass('loginAnim')
                $('#errorMessage').text(res.message)
                
            } else{
                $('#errorMessage').text(res.message)   
            }
            $('.spinner').removeClass('loadAnim')
            $('.spinner').fadeOut()
        })
        .catch(err=>{
            console.error(err)
        })
    }
    
})
const loginBar = $('#loginBar')
const loginForm = $('#loginForm')
loginForm.submit((e)=>{
    e.preventDefault()
    $('#errorMessage').text('')
    const formData = new FormData(document.querySelector('#loginForm'))
    const body = {
        emailUsername: formData.get('emailUsername'),
        password: formData.get('password'),
    }
    loginBar.addClass('loginAnim')
    $('.spinner').fadeIn(800)
    $('.spinner').addClass('loadAnim')
    fetch('/user/login',{
        method: 'POST',
        headers:{
            "Content-type":"application/json"   
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(res=>{
        if(!res.success){
            loginBar.removeClass('loginAnim')
            $('#errorMessage').text(res.message)
            $('.spinner').removeClass('loadAnim')
            $('.spinner').fadeOut()
            
        } else{
            setTimeout(()=>{
                location.href = '/files'
            },2000)
        }
    })
    .catch(err=>{
        console.error(err)
        loginBar.removeClass('loginAnim')
        $('#errorMessage').text('server-Error: 500')
        $('.spinner').removeClass('loadAnim')
        $('.spinner').fadeOut()
    })
})





const signupBar = $('#signupBar')
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
                $('.spinner').removeClass('loadAnim')
                $('.spinner').fadeOut()
                
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
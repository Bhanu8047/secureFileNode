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
                location.href = '/'
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


const forgotBar = $('#forgotBar')
const forgotForm = $('#forgotForm')
forgotForm.submit((e)=>{
    e.preventDefault()
    $('#errorMessage').text('')
    const formData = new FormData(document.querySelector('#forgotForm'))
    const body = {
        email: formData.get('emailUsername'),
    }
    forgotBar.addClass('loginAnim')
    $('.spinner').fadeIn(500)
    $('.spinner').addClass('loadAnim')
    fetch('/getOtp',{
        method: 'POST',
        headers:{
            "Content-type":"application/json"   
        },
        body: JSON.stringify(body)
    })
    .then(res=>res.json())
    .then(res=>{
        if(!res.success){
            forgotBar.removeClass('loginAnim')
            $('#errorMessage').text(res.message)
            $('.spinner').removeClass('loadAnim')
            $('.spinner').fadeOut()
            
        } else{
            $('#errorMessage').text(res.message)
            setTimeout(()=>{
                location.href = '/resetPassword'
            },2000)
        }
    })
    .catch(err=>{
        console.error(err)
        forgotBar.removeClass('loginAnim')
        $('#errorMessage').text('server-Error: 500')
        $('.spinner').removeClass('loadAnim')
        $('.spinner').fadeOut()
    })
})


const resetBar = $('#resetBar')
const resetForm = $('#resetForm')
resetForm.submit((e)=>{
    e.preventDefault()
    $('#errorMessage').text('')
    const formData = new FormData(document.querySelector('#resetForm'))
    const body = {
        email: formData.get('email'),
        password: formData.get('password'),
        otp: formData.get('otp')
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
        resetBar.addClass('loginAnim')
        $('.spinner').fadeIn(500)
        $('.spinner').addClass('loadAnim')
        fetch('/password/reset',{
            method: 'POST',
            headers:{
                "Content-type":"application/json"   
            },
            body: JSON.stringify(body)
        })
        .then(res=>res.json())
        .then(res=>{
            if(!res.success){
                resetBar.removeClass('loginAnim')
                $('#errorMessage').text(res.message)
                $('.spinner').removeClass('loadAnim')
                $('.spinner').fadeOut()
                
            } else{
                $('#errorMessage').text(res.message)
                setTimeout(()=>{
                    location.href = '/login'
                },2000)
            }
        })
        .catch(err=>{
            console.error(err)
            resetBar.removeClass('loginAnim')
            $('#errorMessage').text('server-Error: 500')
            $('.spinner').removeClass('loadAnim')
            $('.spinner').fadeOut()
        })
    }
})
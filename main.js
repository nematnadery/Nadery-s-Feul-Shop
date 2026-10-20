let loginPassword = document.getElementById('login-password')
let loginPassword2 = document.getElementById('login-password2')
let loginError = document.getElementById('login-error')
let loginSubmit = document.getElementById('login-submit')
let loginForm = document.getElementById('login-form')
let logoutBtn = document.getElementById('btn-logout')
let navItem = document.querySelectorAll('.nav-item')

let password = 'Allah.21'


navItem.forEach(function(item){
    
    item.addEventListener('click', function(){
        navItem.forEach(function(Otheritems){
            Otheritems.classList.remove('active')
        })
        item.classList.add('active')
    })
    
})

loginForm.addEventListener('submit', function (event){
    event.preventDefault()
    if(loginPassword.value === password){
        loginError.hidden = true
        document.body.classList.remove('locked')
        loginPassword.value = ""
    }else{
        loginError.hidden = false
        loginError.textContent = 'رمز عبور درست نیست'
    } 
})

logoutBtn.addEventListener('click', function(){
    document.body.classList.add('locked')
    loginError.hidden = true
    loginPassword.focus()
})
let navItems = document.querySelectorAll('.nav-item')
let pages = document.querySelectorAll('.page')
let pageTitle = document.getElementById('page-title')

navItems.forEach(function (item) {
    item.addEventListener('click', function () {
        pages.forEach(function(page){
            page.classList.remove('active')
        })

        let pageId = 'page-' + item.dataset.page
        let mainPage = document.getElementById(pageId) 
        mainPage.classList.add('active')

        navItems.forEach(function(n){
            n.classList.remove('active')
        })

        item.classList.add('active')
        pageTitle.textContent = item.textContent
        
    })
})
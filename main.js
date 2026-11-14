let navItems = document.querySelectorAll('.nav-item')
let pages = document.querySelectorAll('.page')
let pageTitle = document.getElementById('page-title')
let categoryForm = document.getElementById('category-form')
let cName = document.getElementById('c-name')
let cGroup = document.getElementById('c-group')
let cDensity = document.getElementById('c-density')


function showPage(name) {
    pages.forEach(function (page) {
        page.classList.remove('active')
    })
    document.getElementById('page-' + name).classList.add('active')

    // ۲) دکمه‌ها: از همه بردار، به دکمه درست بده
    navItems.forEach(function (item) {
        item.classList.remove('active')
        if (item.dataset.page === name) {
            item.classList.add('active')
            pageTitle.textContent = item.textContent   // ۳) عنوان
        }
    })
}

// با کلیک: صفحه را عوض کن و اسمش را ذخیره کن
navItems.forEach(function (item) {
    item.addEventListener('click', function () {
        showPage(item.dataset.page)
        localStorage.setItem('lastPage', item.dataset.page)
    })
})

// هنگام باز شدن صفحه: اگر چیزی ذخیره شده بود، همان را نشان بده
let lastPage = localStorage.getItem('lastPage')
if (lastPage) {
    showPage(lastPage)
}


categoryForm.addEventListener('submit', function (event) {
    event.preventDefault()          // جلوگیری از رفرش صفحه

    let name = cName.value.trim()   // فاصله‌های اول و آخر پاک می‌شود
    let group = cGroup.value        // 'diesel' یا 'petrol'
    let density = Number(cDensity.value)   // متن را به عدد تبدیل می‌کند

    console.log(name, group, density)
    console.log(typeof density)     // باید number چاپ شود
})
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

let categories = []
categoryForm.addEventListener('submit', function (event) {
    event.preventDefault()

    let name = cName.value.trim()
    let group = cGroup.value
    let density = Number(cDensity.value)

    // اگر نام خالی یا ثقلت نامعتبر بود، چیزی ثبت نکن
    if (name === '' || density <= 0) {
        return
    }

    // ساختن شیء دسته
    let category = {
        id: Date.now(),     // شناسه یکتا: زمان ثبت به میلی‌ثانیه
        name: name,
        group: group,
        density: density
    }

    categories.push(category)   // گذاشتن در آرایه

    console.log(categories)
    categoryForm.reset()        // خالی‌کردن کادرها
})
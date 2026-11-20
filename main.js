let navItems = document.querySelectorAll('.nav-item')
let pages = document.querySelectorAll('.page')
let pageTitle = document.getElementById('page-title')
let categoryForm = document.getElementById('category-form')
let cName = document.getElementById('c-name')
let cGroup = document.getElementById('c-group')
let cDensity = document.getElementById('c-density')
let categoryBody = document.getElementById('category-body')
let categoryEmpty = document.getElementById('category-empty')


function renderCategories() {
    categoryBody.innerHTML = ''      // اول جدول را خالی کن

    categories.forEach(function (category) {
        let tr = document.createElement('tr')

        // ستون نام
        let tdName = document.createElement('td')
        tdName.textContent = category.name

        // ستون گروه (با برچسب رنگی)
        let tdGroup = document.createElement('td')
        let tag = document.createElement('span')
        tag.className = 'tag tag--' + category.group
        tag.textContent = category.group === 'diesel' ? 'دیزل' : 'پطرول'
        tdGroup.appendChild(tag)

        // ستون ثقلت
        let tdDensity = document.createElement('td')
        tdDensity.textContent = category.density

        // ستون حذف (فعلاً فقط دکمه، کارش در ۳-۵ است)
        let tdDelete = document.createElement('td')
        let btn = document.createElement('button')
        btn.className = 'btn-link-danger'
        btn.type = 'button'
        btn.textContent = 'حذف'
        tdDelete.appendChild(btn)

        // چسباندن همه به ردیف و ردیف به جدول
        tr.append(tdName, tdGroup, tdDensity, tdDelete)
        categoryBody.appendChild(tr)
    })

    // پیام «خالی»: فقط وقتی آرایه خالی است دیده شود
    categoryEmpty.hidden = categories.length > 0
}

function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories))
}

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

let categories = JSON.parse(localStorage.getItem('categories')) || []
renderCategories()
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

    categories.push(category)
    saveCategories()            // ← خط تازه
    renderCategories()
    categoryForm.reset()
})
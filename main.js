// ============================================================
// ۱) المان‌هایی که از HTML می‌گیریم
// ============================================================

// منو و صفحه‌ها
let navItems = document.querySelectorAll('.nav-item')
let pages = document.querySelectorAll('.page')
let pageTitle = document.getElementById('page-title')

// فرم و جدول دسته‌ها
let categoryForm = document.getElementById('category-form')
let cName = document.getElementById('c-name')
let cGroup = document.getElementById('c-group')
let cDensity = document.getElementById('c-density')
let categoryBody = document.getElementById('category-body')
let categoryEmpty = document.getElementById('category-empty')


// ============================================================
// ۲) داده‌ها
// ============================================================

// آرایه دسته‌ها: از localStorage می‌خوانیم، اگر نبود آرایه خالی
let categories = JSON.parse(localStorage.getItem('categories')) || []


// ============================================================
// ۳) تابع‌ها
// ============================================================

// یک صفحه را نشان بده (name اسم صفحه است، مثلاً 'sales')
function showPage(name) {
    // از همه صفحه‌ها active را بردار، بعد به صفحه درست بده
    pages.forEach(function (page) {
        page.classList.remove('active')
    })
    document.getElementById('page-' + name).classList.add('active')

    // از همه دکمه‌ها active را بردار، بعد به دکمه درست بده
    navItems.forEach(function (item) {
        item.classList.remove('active')
        if (item.dataset.page === name) {
            item.classList.add('active')
            pageTitle.textContent = item.textContent   // عنوان بالای صفحه
        }
    })
}

// آرایه categories را در localStorage ذخیره کن
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories))
}

// جدول دسته‌ها را از روی آرایه categories از نو بساز
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
        btn.addEventListener('click', function () {
            categories = categories.filter(function (c) {
                return c.id !== category.id     // همه را نگه دار، جز این یکی
            })
            saveCategories()                    // ذخیره
            renderCategories()                  // جدول را دوباره بساز
        })
        tdDelete.appendChild(btn)
        

        // چسباندن ستون‌ها به ردیف و ردیف به جدول
        tr.append(tdName, tdGroup, tdDensity, tdDelete)
        categoryBody.appendChild(tr)
    })

    // پیام «خالی»: فقط وقتی دسته‌ای نیست دیده شود
    categoryEmpty.hidden = categories.length > 0
}


// ============================================================
// ۴) رویدادها
// ============================================================

// کلیک روی منو: صفحه را عوض کن و اسمش را ذخیره کن
navItems.forEach(function (item) {
    item.addEventListener('click', function () {
        showPage(item.dataset.page)
        localStorage.setItem('lastPage', item.dataset.page)
    })
})

// ارسال فرم دسته: دسته تازه بساز و ذخیره کن
categoryForm.addEventListener('submit', function (event) {
    event.preventDefault()          // جلوگیری از رفرش صفحه

    // مقدارهای فرم
    let name = cName.value.trim()
    let group = cGroup.value
    let density = Number(cDensity.value)

    // اگر نام خالی یا ثقلت نامعتبر است، چیزی ثبت نکن
    if (name === '' || density <= 0) {
        return
    }

    // ساختن شیء دسته
    let category = {
        id: Date.now(),             // شناسه یکتا
        name: name,
        group: group,
        density: density
    }

    categories.push(category)       // گذاشتن در آرایه
    saveCategories()                // ذخیره
    renderCategories()              // نمایش در جدول
    categoryForm.reset()            // خالی‌کردن کادرها
})


// ============================================================
// ۵) شروع: کارهایی که هنگام باز شدن صفحه انجام می‌شود
// ============================================================

// آخرین صفحه‌ای که باز بود را نشان بده
let lastPage = localStorage.getItem('lastPage')
if (lastPage) {
    showPage(lastPage)
}

// جدول دسته‌ها را با داده‌های ذخیره‌شده بساز
renderCategories()
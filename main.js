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
// فرم ظرفیت بیلر
let generalForm = document.getElementById('general-form')
let setBilar = document.getElementById('set-bilar')
// فرم و جدول قیمت‌ها
let priceForm = document.getElementById('price-form')
let prCategory = document.getElementById('pr-category')
let prDate = document.getElementById('pr-date')
let prPrice = document.getElementById('pr-price')
let priceBody = document.getElementById('price-body')
let priceEmpty = document.getElementById('price-empty')
// فرم خرید (فعلاً فقط کادرهای پیش‌نمایش)
let pCategory = document.getElementById('p-category')
let pUnit = document.getElementById('p-unit')
let pQty = document.getElementById('p-qty')
let pTotal = document.getElementById('p-total')
let pPrevLiters = document.getElementById('p-prev-liters')
let pPrevCost = document.getElementById('p-prev-cost')
let purchaseForm = document.getElementById('purchase-form')
let pDate = document.getElementById('p-date')
let pSupplier = document.getElementById('p-supplier')
// جدول خریدها
let purchaseBody = document.getElementById('purchase-body')
let purchaseEmpty = document.getElementById('purchase-empty')

// ============================================================
// ۲) داده‌ها
// ============================================================

// آرایه دسته‌ها: از localStorage می‌خوانیم، اگر نبود آرایه خالی
let categories = JSON.parse(localStorage.getItem('categories')) || []
// آرایه قیمت‌ها: هر قیمت یک شیء است
let prices = JSON.parse(localStorage.getItem('prices')) || []
// آرایه خریدها: هر خرید یک شیء است
let purchases = JSON.parse(localStorage.getItem('purchases')) || []
// اسم واحدها به فارسی (برای نمایش در جدول)
let unitNames = { ton: 'تن', bilar: 'بیلر', liter: 'لیتر' }


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
            // دسته‌ای که خرید دارد حذف نمی‌شود
            let hasPurchase = purchases.some(function (p) {
                return p.categoryId === category.id
            })

            if (hasPurchase) {
                alert('این دسته خرید دارد و حذف نمی‌شود')
                return
            }

            categories = categories.filter(function (c) {
                return c.id !== category.id     // همه را نگه دار، جز این یکی
            })
            saveCategories()
            renderCategories()
        })
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

    fillCategorySelect(prCategory)   // لیست دسته‌ها در فرم قیمت
    fillCategorySelect(pCategory)    // لیست دسته‌ها در فرم خرید
    renderPrices()                   // اسم دسته‌ها در جدول قیمت
    updatePreview()                  // پیش‌نمایش را با دسته‌های تازه به‌روز کن
}

// قیمت‌ها را ذخیره کن
function savePrices() {
    localStorage.setItem('prices', JSON.stringify(prices))
}

// خریدها را ذخیره کن
function savePurchases() {
    localStorage.setItem('purchases', JSON.stringify(purchases))
}

// جدول خریدها را از روی آرایه purchases از نو بساز
function renderPurchases() {
    purchaseBody.innerHTML = ''

    // تازه‌ترین بالا: اول تاریخ، اگر برابر بود شناسه
    let sorted = [...purchases].sort(function (a, b) {
        return b.date.localeCompare(a.date) || b.id - a.id
    })

    sorted.forEach(function (purchase) {
        // اسم دسته را از روی id پیدا کن
        let category = categories.find(function (c) {
            return c.id === purchase.categoryId
        })

        let tr = document.createElement('tr')

        // خرید باطل‌شده: کم‌رنگ و خط‌خورده، با دلیل در راهنمای موس
        if (purchase.voided) {
            tr.className = 'is-void'
            tr.title = 'دلیل: ' + purchase.voidReason
        }

        let tdDate = document.createElement('td')
        tdDate.textContent = purchase.date

        let tdCategory = document.createElement('td')
        tdCategory.textContent = category ? category.name : '—'

        let tdQty = document.createElement('td')
        tdQty.textContent = purchase.qty + ' ' + unitNames[purchase.unit]

        let tdLiters = document.createElement('td')
        tdLiters.textContent = Math.round(purchase.liters)

        let tdTotal = document.createElement('td')
        tdTotal.textContent = purchase.total

        let tdCost = document.createElement('td')
        tdCost.textContent = costPerLiter(purchase.total, purchase.liters).toFixed(2)

        let tdSupplier = document.createElement('td')
        tdSupplier.textContent = purchase.supplier || '—'

        // ستون آخر: برچسب «باطل» یا دکمه «باطل»
        let tdAction = document.createElement('td')

        if (purchase.voided) {
            let tag = document.createElement('span')
            tag.className = 'tag tag--void'
            tag.textContent = 'باطل'
            tdAction.appendChild(tag)
        } else {
            let btn = document.createElement('button')
            btn.className = 'btn-link-danger'
            btn.type = 'button'
            btn.textContent = 'باطل'

            btn.addEventListener('click', function () {
                let reason = prompt('دلیل باطل‌کردن را بنویسید:')

                // انصراف یا دلیل خالی: باطل نکن
                if (reason === null || reason.trim() === '') {
                    return
                }

                purchase.voided = true
                purchase.voidReason = reason.trim()
                savePurchases()
                renderPurchases()
            })

            tdAction.appendChild(btn)
        }

        tr.append(tdDate, tdCategory, tdQty, tdLiters, tdTotal, tdCost, tdSupplier, tdAction)
        purchaseBody.appendChild(tr)
    })

    purchaseEmpty.hidden = purchases.length > 0
}
// لیست «دسته» در فرم قیمت را از روی آرایه categories پر کن
// لیست «دسته» را در هر select که بدهیم پر کن
function fillCategorySelect(select) {
    select.innerHTML = ''

    categories.forEach(function (category) {
        let option = document.createElement('option')
        option.value = category.id          // آنچه ذخیره می‌شود
        option.textContent = category.name  // آنچه کاربر می‌بیند
        select.appendChild(option)
    })
}

// جدول قیمت‌ها را از نو بساز (تازه‌ترین بالا)
function renderPrices() {
    priceBody.innerHTML = ''

    // کپی آرایه را مرتب کن: تاریخ بزرگ‌تر (تازه‌تر) اول
    let sorted = [...prices].sort(function (a, b) {
        return b.date.localeCompare(a.date)
    })

    sorted.forEach(function (item) {
        // اسم دسته را از روی id پیدا کن
        let category = categories.find(function (c) {
            return c.id === item.categoryId
        })

        let tr = document.createElement('tr')

        let tdCategory = document.createElement('td')
        tdCategory.textContent = category ? category.name : 'دسته حذف‌شده'

        let tdDate = document.createElement('td')
        tdDate.textContent = item.date

        let tdPrice = document.createElement('td')
        tdPrice.textContent = item.price

        tr.append(tdCategory, tdDate, tdPrice)
        priceBody.appendChild(tr)
    })

    priceEmpty.hidden = prices.length > 0
}

// پیش‌نمایش زنده: معادل لیتر و قیمت هر لیتر را حساب و نشان می‌دهد
function updatePreview() {
    let unit = pUnit.value
    let qty = Number(pQty.value)
    let total = Number(pTotal.value)
    let bilar = Number(localStorage.getItem('bilar'))   // اگر ذخیره نشده باشد، 0

    // دسته انتخاب‌شده را از روی id پیدا کن
    let category = categories.find(function (c) {
        return c.id === Number(pCategory.value)
    })

    // اگر دسته یا مقدار درست نیست، خط تیره نشان بده
    if (!category || qty <= 0) {
        pPrevLiters.textContent = '—'
        pPrevCost.textContent = '—'
        return
    }

    let liters = toLiters(unit, qty, category.density, bilar)
    let cost = costPerLiter(total, liters)

    // گرد‌کردن فقط برای نمایش است
    pPrevLiters.textContent = Math.round(liters)
    pPrevCost.textContent = cost.toFixed(2)
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

// هر تغییر در این چهار کادر، پیش‌نمایش را به‌روز می‌کند
let previewInputs = [pCategory, pUnit, pQty, pTotal]

previewInputs.forEach(function (el) {
    el.addEventListener('input', updatePreview)
})

// ارسال فرم خرید: خرید تازه بساز و ذخیره کن
purchaseForm.addEventListener('submit', function (event) {
    event.preventDefault()

    // مقدارهای فرم
    let date = pDate.value
    let categoryId = Number(pCategory.value)
    let unit = pUnit.value
    let qty = Number(pQty.value)
    let total = Number(pTotal.value)
    let supplier = pSupplier.value.trim()

    // دسته را پیدا کن (برای ثقلت)
    let category = categories.find(function (c) {
        return c.id === categoryId
    })

    // اگر چیزی ناقص یا نامعتبر است، ثبت نکن
    if (date === '' || !category || qty <= 0 || total <= 0) {
        return
    }

    // لیتر را همین حالا حساب کن (بعداً با عوض‌شدن ثقلت یا بیلر تغییر نکند)
    let bilar = Number(localStorage.getItem('bilar'))
    let liters = toLiters(unit, qty, category.density, bilar)

    if (liters <= 0) {
        alert('معادل لیتر صفر شد. اگر بیلر انتخاب کرده‌اید، ظرفیت بیلر را در تنظیمات ذخیره کنید.')
        return
    }

    // ساختن شیء خرید
    let purchase = {
        id: Date.now(),
        date: date,
        categoryId: categoryId,
        unit: unit,             // آنچه کاربر وارد کرد
        qty: qty,
        liters: liters,         // حساب‌شده در همین لحظه
        total: total,
        supplier: supplier,
        voided: false           // برای باطل‌کردن در ۴-۵
    }

    purchases.push(purchase)
    savePurchases()
    renderPurchases()
    purchaseForm.reset()
    updatePreview()             // reset رویداد input نمی‌دهد، پس پیش‌نمایش را دستی تازه کن
})

// ارسال فرم بیلر: عدد را ذخیره کن
generalForm.addEventListener('submit', function (event) {
    event.preventDefault()

    let bilar = Number(setBilar.value)

    // اگر عدد صفر یا منفی است، چیزی ذخیره نکن
    if (bilar <= 0) {
        return
    }

    localStorage.setItem('bilar', bilar)
    alert('ذخیره شد')
})

// ارسال فرم قیمت: قیمت تازه بساز و ذخیره کن
priceForm.addEventListener('submit', function (event) {
    event.preventDefault()

    let categoryId = Number(prCategory.value)   // value همیشه متن است
    let date = prDate.value                     // مثل 2026-11-21
    let priceValue = Number(prPrice.value)

    if (date === '' || priceValue <= 0) {
        return
    }

    let price = {
        id: Date.now(),
        categoryId: categoryId,
        date: date,
        price: priceValue
    }

    prices.push(price)
    savePrices()
    renderPrices()
    priceForm.reset()
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
// ظرفیت بیلر ذخیره‌شده را در کادر بگذار
let savedBilar = localStorage.getItem('bilar')
if (savedBilar) {
    setBilar.value = savedBilar
}
renderPurchases()
// تابع‌های حسابی (بدون کار با صفحه: فقط عدد می‌گیرند و عدد برمی‌گردانند)

// مقدار خرید را به لیتر تبدیل می‌کند
// unit: 'ton' یا 'bilar' یا 'liter'
// qty: مقداری که کاربر نوشته
// density: ثقلت دسته (کیلوگرم در هر لیتر)
// bilarCapacity: یک بیلر چند لیتر است
function toLiters(unit, qty, density, bilarCapacity) {
    switch (unit) {
        case 'liter':
            return qty                       // همان لیتر است

        case 'bilar':
            return qty * bilarCapacity       // تعداد بیلر × ظرفیت هر بیلر

        case 'ton':
            return qty * 1000 / density      // تن را کیلوگرم کن، بر ثقلت تقسیم کن

        default:
            return 0                         // واحد ناشناخته
    }
}

// قیمت هر لیتر را حساب می‌کند
// totalPrice: قیمت کل خرید (افغانی)
// liters: معادل لیتر
function costPerLiter(totalPrice, liters) {
    // اگر لیتر صفر یا منفی است، تقسیم نکن (جلوگیری از Infinity)
    if (liters <= 0) {
        return 0
    }

    return totalPrice / liters
}
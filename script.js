let clicky = document.getElementById('clicky')
setInterval(()=>{
    if(clicky.innerHTML == "_") clicky.innerHTML = " "
    else clicky.innerHTML = "_"
},600)

let html_container = document.getElementById('container')
let global_int = 0
let error = false
let bases = [
    {
        name: 'binary',
        int: 2,
        get_string: () => {
            let text = digits_to_text(int_to_base_n(global_int, 2))
            console.log('base 2 set', text)
            return text
        }
    },
    {
        name: 'octal',
        int: 8,
        get_string: () => {
            let text = digits_to_text(int_to_base_n(global_int, 8))
            console.log('base 8 set', text)
            return text
        }
    },
    {
        name: 'decimal',
        int: 10,
        get_string: () => {
            let text = digits_to_text(int_to_base_n(global_int, 10))
            console.log('base 10 set', text)
            return text
        }
    },
    {
        name: 'hexadecimal',
        int: 16,
        get_string: () => {
            let text = digits_to_text(int_to_base_n(global_int, 16))
            console.log('base 16 set', text)
            return text
        }
    },
    {
        name: 'gray_code',
        int: 0,
        get_string: () => {
            let text = digits_to_text(binary_to_gray(base_convert(int_to_digits(Math.floor(global_int)), 10, 2)))
            console.log('gray code set', text)
            return text
        }
    },
    {
        name: 'binary_coded_decimal - BCD',
        int: 0,
        get_string: () => {
            let text = digits_to_text(decimal_to_bcd(int_to_digits(Math.floor(global_int))))
            console.log('binary code decimal set', text)
            return text
        }
    }
]

html_container.innerHTML = ''

for(let base of bases){
    let new_element = document.createElement("div")
    new_element.innerHTML = `
        <div class="slot" id="${base.name}_div">
            <div>${base.name}${base.int != 0 ? ' - base_'+base.int : ''}:</div>
            <input type="text" value="${base.get_string()}" id="${base.name}_input" data-int="${base.int}"></input>
        </div>
    `
    html_container.appendChild(new_element)
}

for(let base of bases){
    if(base.int >= 2) document.getElementById(base.name+'_input').addEventListener('input', (event)=>{
        let input = event.target.value.replaceAll(" ", "").split('.')
        if(input.length == 1) input.push('0')
        if(input[0] == '') input[0] = '0'
        if(input.length > 2) error = true
        input[1] = input[1].split('').reverse().join('')
        let b = parseInt(event.target.getAttribute('data-int'))
        error = error || input[0].split('').some((digit)=>{
            let index = all_digits.indexOf(digit.toUpperCase()) 
            return index < 0 || index >= b
        })
        error = error || input[1].split('').some((digit)=>{
            let index = all_digits.indexOf(digit.toUpperCase()) 
            return index < 0 || index >= b
        })
        if(error) console.error('input error:', input, 'base', b)
        else{
            console.log('%c --input: '+input[0]+'.'+input[1]+' base '+b, 'color: #8BF')
            global_int = to_decimal_int(text_to_digits(input[0]), b) + fraction_to_decimal_int(text_to_digits(input[1]), b)
            console.log('global int set', global_int)
            console.log('--html called--')
        }
        update_html(event.target.id)
    })
    if(base.name == 'gray_code') document.getElementById(base.name+'_input').addEventListener('input', (event)=>{
        let input = event.target.value.replaceAll(" ", "")
        error = input.split('').some((digit)=>{
            return digit != 0 && digit != 1
        })
        if(error) console.error('input error:', input, 'gray code')
        else{
            console.log('%c --input: '+input+ ' gray code', 'color: #8BF')
            global_int = to_decimal_int(gray_to_binary(text_to_digits(input)), 2)
            console.log('global int set', global_int)
            console.log('--html called--')
        }
        update_html(event.target.id)
    })
    if(base.name == 'binary_coded_decimal - BCD') document.getElementById(base.name+'_input').addEventListener('input', (event)=>{
        let input = event.target.value.replaceAll(" ", "")
        error = input.split('').some((digit)=>{
            return digit != 0 && digit != 1
        })
        error = error || (input.length % 4 != 0)
        if(error) console.error('input error:', input, 'binary_coded_decimal - BCD')
        else{
            console.log('%c --input: '+input+ ' binary_coded_decimal - BCD', 'color: #8BF')
            global_int = to_decimal_int(bcd_to_decimal(text_to_digits(input).reverse()), 10)
            console.log('global int set', global_int)
            console.log('--html called--')
        }
        update_html(event.target.id)
    })
}

function update_html(skip){
    for(let base of bases){
        if(base.name+'_input' == skip) continue
        document.getElementById(base.name+'_input').value = base.get_string()
    }
    if(error) document.getElementById('error').style.opacity = '100%'
    if(!error) document.getElementById('error').style.opacity = '0%'
    console.log('%c  --html updated-- ', 'color: #3C8')
    console.log('')
    error = false
}

update_html(0)



function add_n_base(n){
    if(typeof(n) != 'number') return 1
    bases.push({
        name: 'base_' + n,
        int: n,
        get_string: () => {
            let text = digits_to_text(base_convert(int_to_digits(global_int), 10, n))
            console.log('base n set', text)
            return text
        }
    })
    
    let new_element = document.createElement("div")
    new_element.innerHTML = `
        <div class="slot" id="base_${n}_div">
            <div>base_${n}:</div>
            <input type="text" value="0" id="base_${n}_input" data-int="${n}"></input>
        </div>
    `
    html_container.appendChild(new_element)

    document.getElementById('base_'+n+'_input').addEventListener('input', (event)=>{
        let input = event.target.value.replaceAll(" ", "")
        let b = parseInt(event.target.getAttribute('data-int'))
        error = input.split('').some((digit)=>{
            let index = all_digits.indexOf(digit.toUpperCase()) 
            return index < 0 || index >= b
        })
        if(error) console.error('input error:', input, 'base', b)
        else{
            error = false
            console.log('%c --input: '+input+' base '+b, 'color: #8BF')
            global_int = to_decimal_int(text_to_digits(input), b)
            console.log('global int set', global_int)
            console.log('--html called--')
        }
        update_html(event.target.id)
    })
    console.log('%c --new base ' + n + ' added--', 'color: #5F9')
    update_html(0)

    return 0
}

document.getElementById("add").addEventListener("click", ()=>{
    let n = parseInt(prompt("enter n:"))
    if(1 < n && n < 37) add_n_base(n)
    else console.error("invalid new base")
})

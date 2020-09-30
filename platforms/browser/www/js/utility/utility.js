// FUNZIONI JAVASCRIPT DI UTILITA' COMUNI A TUTTE LE PAGINE DEL GESTIONALE


function validateEmail(email) {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (emailReg.test(email)) {
        return true;
    } else return false;
}


// Verifica se una stringa contiene un json valido
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



function roundDecimal(x) {
    x = x.toFixed(2); //returns string fixed to 2 decimal places
    x = parseFloat(x);
    return x;
}



function pre_zero(x) {
    if (!x || x == '') return x;

    x = x.toString();

    if (x.length <= 1) {
        x = '0' + x;
    }
    return x;
}




// Replace All
function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(str, find, replace) {
    if (!str || str == '') { return ''; }
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}




// Trasformo un millistamp nei giorni, minuti, ore e secondi che rappresenta
function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    return { d: d, h: h, m: m, s: s };
};



// abbreviazione per LocalStorage
function ls(name, value){
    if(typeof value == 'undefined'){ // lettura
        return localStorage.getItem(name);
    } else { // scrittura
        return localStorage.setItem(name, value);
    }
}


// Tap su show-password
$(document).on('tap', '.pwd_show', function(e){
    e.preventDefault();
    if(e.handled !== true){
        var $this = $(this);
        var $icon = $this.find('i');
        var $id_input = $this.attr('data-id');

        if($icon.hasClass('fa-eye')){
            // devo mostrare la pwd
            $icon.removeClass('fa-eye fa-eye-slash').addClass('fa-eye-slash');
            $('#' + $id_input).attr('type', 'input');
        } else {
            // nascondo la pwd
            $icon.removeClass('fa-eye fa-eye-slash').addClass('fa-eye');
            $('#' + $id_input).attr('type', 'password');
        }
        e.handled = true;
    }
});

$(document).on('tap', '#changePwd_btn', function(e){
    e.preventDefault();
    if(e.handled !== true){
        console.log('Procedura cambio password');
        var pwd1 = $('#changePwd_pwd1').val();
        var pwd2 = $('#changePwd_pwd2').val();

        var pwd_old = $('#login_pwd').val();
        var mail = $('#login_mail').val();

        if(pwd1 == "" || pwd2 == ""){
            navigator.notification.alert("Devi compilare i due campi!", function () { }, 'ERRORE', 'Ok');
            return false;
        }

        if(pwd1 != pwd2){
            navigator.notification.alert("Le due password non corrispondono!", function () { }, 'ERRORE', 'Ok');
            return false;
        }

        if(pwd_old == "" || mail == ""){
            navigator.notification.alert("I campi email e la password precedente non sono compilati. Torna al passo precedente!", function () { }, 'ERRORE', 'Ok');
            return false;
        }

        if(pwd1.toString().length < 8){
            navigator.notification.alert("La password deve contenere almeno 8 caratteri!", function () { }, 'ERRORE', 'Ok');
            return false;
        }

        var regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/;
        if(!regex.test(pwd1)){
            navigator.notification.alert("La password non rispetta il formato richiesto!", function () { }, 'ERRORE', 'Ok');
            return false;
        }


        // controlli superati
        var message = { Username: mail, OldPassword: pwd_old, NewPassword: pwd1 };
        var json_data = { Action: 8, Tenant:1, Message: JSON.stringify(message) };
        console.log("JSON CHANGE PWD: " + JSON.stringify(json_data));
        var addr = server + 'hub';

        $.ajax({
            type: "POST",
            url: addr,
            dataType: "json",
            contentType: "application/json",
            crossDomain: true,
            data: JSON.stringify(json_data),
            success: function (doc) {
                console.log(JSON.stringify(doc));
                if(doc == "User changed password successfully."){
                    // operazione riuscita
                    $('#login_pwd').val(pwd1);
                    $("body").pagecontainer("change", "#unlogged");
                    $('#login_go').trigger('tap');

                } else {
                    // operazione non riuscita
                    navigator.notification.alert("Operazione non riuscita. Controlla le password inserite e riprova!", function () { }, 'ERRORE', 'Ok');
                    return false;
                }
            },
            error: function (e, h, i) {
                // errore
                console.log(JSON.stringify(e));
                console.log(JSON.stringify(h));
                console.log(JSON.stringify(i));

                if(e.status && e.status.toString() == "406"){
                    navigator.notification.alert("La password non rispetta il formato richiesto!", function () { }, 'ERRORE', 'Ok');
                    return false;
                } 
                else
                {
                    navigator.notification.alert("Operazione non riuscita. Si prega di riprovare!", function () { }, 'ERRORE', 'Ok');
                    return false;
                }
            }
        });

        e.handled = true;
    }
})
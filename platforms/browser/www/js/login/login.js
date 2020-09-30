// Pressione pulsanti login/logout
$(document).on('tap', '.logInOut', function (e) {

    e.preventDefault();
    if (e.handled !== true) {

        if (!localStorage.getItem("maesafe_id") || localStorage.getItem("maesafe_id") == '') {
            // Utente non loggato
            do_login();

        } else {
            // Utente loggato

            navigator.notification.confirm("Vuoi davvero effettuare il Log-Out?",
                function (buttonIndex) {
                    if (buttonIndex == 1) {

                        completeLogout();
                    }
                }, "LOG-OUT", "Sì,No");

        }

        e.handled = true;
    }
});




function completeLogout() {
    ble.isConnected(ls("maesafe_bt_mac"), function() {
        ble.disconnect(ls("maesafe_bt_mac"), function(){
            completeLogout2();
        },
        function(){
            completeLogout2();
        });
    },
    function(){
        completeLogout2();
    });
}

function completeLogout2() {
    cordova.plugins.backgroundMode.disable(); // attivo il background-mode
    var token = ls("maesafe_token");
    var unsended = ls("maesafe_unsended_alarm");

    localStorage.clear();
    // reimposto il token nelle localStorage. Al prossimo login sarà inviato al db
    ls("maeapp_token", token);
    ls("maesafe_unsended_alarm", unsended);
    clearInterval(settings.timer_sync);
    clearInterval(settings.timer_read_temp); // disattivo lettura periodica allarmi
    clearInterval(settings.timer_cron_alarm); // interrompo cron invio allarmi residui

    // Per uomo a terra
    /*
    clearTimeout(settings.timer_alarm_watchId);
    navigator.accelerometer.clearWatch(settings.observer_watchID);
    settings.data_watchId = [];
    */

    window.location = "index.html";
}




function do_login() {
    var mail = $('#login_mail').val();
    var pwd = $('#login_pwd ').val();
    var duid = device.uuid? device.uuid : "browser";

    if (mail == '' || pwd == '') {
        navigator.notification.alert("I campi email e password sono obbligatori!", function () { }, 'AVVISO', 'Ok');
        return false;
    }

    var json_data = { Email: mail, Password: pwd, RememberMe: true, DeviceUID: duid };
    //console.log("JSON LOGIN: " + JSON.stringify(json_data));
    var addr = server + 'login';

    $.ajax({
        type: "POST",
        url: addr,
        dataType: "json",
        //contentType: "application/json; charset=utf-8",
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify(json_data),
        success: function (doc) {

            //console.log(JSON.stringify(doc));

            if (typeof doc == 'object' && IsJsonString(JSON.stringify(doc))) {
                if (!doc.success) {
                    store = {};

                    navigator.notification.alert("Credenziali non valide. Riprova!", function () { }, 'ERRORE', 'Ok');
                    return false;
                }

                login_done(doc);
                return false;
            } else {
                navigator.notification.alert("Un errore impedisce l\'accesso. Riprova! (Cod. lo1)", function () { }, 'ERRORE', 'Ok');
                return false;
            }
        },
        error: function (e, h, i) {
            console.log(JSON.stringify(e));
            console.log(JSON.stringify(h));
            console.log(JSON.stringify(i));

            // verifico se serve un cambio password
            if(e.responseText && JSON.parse(e.responseText) && JSON.parse(e.responseText).details[0] && JSON.parse(e.responseText).details[0].code){
                let errorCode = JSON.parse(e.responseText).details[0].code;

                if(errorCode.toString() === "401.1" || errorCode.toString() === "401.2"){
                    // serve un cambio password
                    $("body").pagecontainer("change", "#changePwd");
                    window.plugins.toast.showWithOptions({ message: 'Modifica la tua password', duration: "long", position: "bottom", addPixelsY: -40 });
                } else {
                    navigator.notification.alert("Accesso non riuscito. (Cod. lo2)", function () { }, 'ERRORE', 'Ok');
                    return false;
                }
            }
            else
            {
                navigator.notification.alert("Accesso non riuscito. (Cod. lo2)", function () { }, 'ERRORE', 'Ok');
                return false;
            }
            
        }
    });
}



function login_done(doc) {
    if(!device.uuid || device.uuid == "") device.uuid = "browser";
    cordova.plugins.backgroundMode.enable(); // attivo il background-mode
    $('#login_mail').val('');
    $('#login_pwd ').val('');
    
    //console.log(doc.data.tenants);
    //console.log(doc.data.roles);

    var tenantId = 0;
    if(doc.data.tenants){
        var myTenants = $.grep(doc.data.tenants, function (element, index) {
            return element.aziendaID == doc.data.tenantId;
        });
        tenantId = myTenants[0].nomeAzienda;
    }
    

    var role = "";
    if(doc.data.roles){
        var myRoles = $.grep(doc.data.roles, function (element, index) {
            return element.aziendaId == doc.data.tenantId;
        });
        role = myRoles[0].name;
    }
    

    localStorage.setItem("maesafe_id", doc.data.userInfo.utenteID);
    localStorage.setItem("maesafe_fullName", /*doc.data.fullName.trim() != "" ? doc.data.fullName :*/ doc.data.userInfo.nome + ' ' + doc.data.userInfo.cognome);
    var iniziali = ls("maesafe_fullName").split(' ')[0] + ls("maesafe_fullName").split(' ')[1]
    $('.sidebar_header_sigla').html(iniziali);
    localStorage.setItem("maesafe_tenantId", doc.data.tenantId);
    localStorage.setItem("maesafe_tenantName", tenantId);
    localStorage.setItem("maesafe_role", role);
    localStorage.setItem("maesafe_authorizationBearer", doc.data.authorizationBearer);
    //("************ BEARER RICEVUTO AL LOGIN:" + doc.data.authorizationBearer);
    
    

    localStorage.setItem("maesafe_proximityMeasureEndpoint", doc.data.settings.proximityMeasureEndpoint);
    localStorage.setItem("maesafe_temperatureMeasureEndpoint", doc.data.settings.temperatureMeasureEndpoint);
    localStorage.setItem("maesafe_deviceSubscriptionEndpoint", doc.data.settings.deviceSubscriptionEndpoint);
    localStorage.setItem("maesafe_survey", doc.data.settings.survey.toString());
    localStorage.setItem("maesafe_token_sso", doc.data.settings.token);
    localStorage.setItem("maesafe_webPortalUrl", doc.data.settings.webPortalUrl);
    
    localStorage.setItem("maesafe_bt_mac", "");
    localStorage.setItem("maesafe_authToken", "");

    var stop = false;
    if(doc.data.devices && doc.data.devices.length > 0){
        $.each(doc.data.devices, function(k, v){
            //console.log("===============", v.name, v.deviceUid, v.bluetoothUid);
            if(v.name == "PHONE" && v.deviceUid == device.uuid.toString()){
                ls("maesafe_authToken", v.authToken); // memorizzo authToken relativo al mio telefono
            }

            if(v.name == "BRACELET" && v.bluetoothUid != null){
                if(v.bluetoothUid !== ""){
                    if(!check_format_string_bracelet(v.bluetoothUid)){ // definita in accessory.js
                        stop = true;
                        return false;
                    }
                }
                ls("maesafe_bt_mac", v.bluetoothUid); // memorizzo l'address del mio bracciale. Potrebbero averlo dissociato da back-end
            }
        });
    }
    if(stop) return false;
    
    if(doc.data.settings.itr) settings.itr = doc.data.settings.itr;
    if(doc.data.settings.sad) settings.sad = ("0" + doc.data.settings.sad.toString()).slice(-3);
    if(doc.data.settings.sat) settings.sat = ("0" + doc.data.settings.sat.toString()).slice(-3);
    if(doc.data.settings.sda) { // adatto i valori di SDA (da 0 a 3)
        switch(doc.data.settings.sda.toString()){
            case "100":
                settings.sda = 1;
            break;
            case "150":
                settings.sda = 2;
            break;
            case "200":
                settings.sda = 3;
            break;
        }
    }
    if(doc.data.settings.std) settings.std = doc.data.settings.std;
    if(doc.data.settings.sta) settings.sta = doc.data.settings.sta;
    if(doc.data.settings.trt) settings.trt = doc.data.settings.trt;
    if(doc.data.settings.sbr) settings.sbr = doc.data.settings.sbr;
    if(doc.data.settings.wut) settings.wut = doc.data.settings.wut;
    if(doc.data.settings.mav) settings.mav = doc.data.settings.mav;
    if(doc.data.settings.mtu) settings.mtu = doc.data.settings.mtu;
    if(doc.data.settings.ira) settings.mtu = doc.data.settings.ira;
    if(doc.data.settings.tad) settings.mtempAdjustu = doc.data.settings.tad;
    if(doc.data.settings.csr) settings.csr = doc.data.settings.csr;
    //if(doc.data.settings.rbt) settings.rbt = doc.data.settings.rbt;
    
    /*
    if(doc.data.settings.uat) settings.uat = doc.data.settings.uat;
    if(doc.data.settings.dut) settings.dut = doc.data.settings.dut;
    if(doc.data.settings.rut) settings.rut = doc.data.settings.rut;
    */

    // Verifica versione App
    if(settings.mav && settings.mav != ""){
        var versione_locale = settings.app_version.toString().split('.');
        var versione_minima = settings.mav.toString().split('.');

        if(parseInt(versione_locale[0]) < parseInt(versione_minima[0]) || parseInt(versione_locale[1]) < parseInt(versione_minima[1])){
            // necessario aggiornare l'app
            $("body").pagecontainer("change", "#aggiorna");
        } else if(parseInt(versione_locale[2]) < parseInt(versione_minima[2])){
            window.plugins.toast.showWithOptions({ message: 'E\' disponibile una nuova versione dell\'app.', duration: "long", position: "bottom", addPixelsY: -40 });
        }
    }

    // Imposto quali grandezze monitorare
    var arr_itr = settings.itr.toString().split('');
    ls("maesafe_use_temp", true);
    if(arr_itr[0] == "0") { // Non monitoro temperatura
        ls("maesafe_use_temp", false);
        $('#temp_row').hide();
        $('#alarms_row_temp').hide();
    } else { // monitoro la temperatura
        ls("maesafe_use_temp", true);
        $('#alarms_row_temp').show();
    }
    ls("maesafe_use_prox", true);
    if(arr_itr[1] == "0") { // Non monitoro prossimità
        ls("maesafe_use_prox", false);
        $('#prox_row').hide();
        $('#alarms_row_prox').hide();
    } else { // monitoro prossimità
        ls("maesafe_use_prox", true);
        $('#alarms_row_prox').show();
    }

    

    // TODO
    // se ci sono più aziende, devo consentirne la scelta e creare un menù a tendina x far scegliere anche in seguito

    // verifico l'autorizzazione alle notifiche push (locali)
    cordova.plugins.notification.local.hasPermission(function (granted) { 
        if(!granted){
            cordova.plugins.notification.local.requestPermission(function (granted) { 
                //console.log("Local notification permission: " + granted);
                pagination_log_unlog();
            });
        } else {
            // Notifiche già concesse
            pagination_log_unlog();
        }
    });
    
}


function pagination_log_unlog() {
    if (localStorage.getItem("maesafe_id") && localStorage.getItem("maesafe_id") != "") {
        // AREA LOGGATI
        cordova.plugins.backgroundMode.enable(); // attivo il background-mode
        $('.rif_user_full_name').html(localStorage.getItem("maesafe_fullName"));
        $('.rif_nome_azienda').html(localStorage.getItem("maesafe_tenantName"));
        var iniziali = ls("maesafe_fullName").split(' ')[0].charAt(0) + ls("maesafe_fullName").split(' ')[1].charAt(0);
        $('.sidebar_header_sigla').html(iniziali);

        if(ls("maesafe_bt_mac").trim() != ""){

            // paginazione in basae al tenant..... ;)
            if(ls("maesafe_tenantId").toString() == "2"){
                $("body").pagecontainer("change", "#badgeIn");
                $('#faq_content').html('Stai riscontrando problemi di accesso o difficoltà nell\'uso dell\'app?<br />Contattaci via email all\'indirizzo maestraleinformation@gmail.com');
                
            } else {
                $("body").pagecontainer("change", "#logged");
            }

            if(!settings.isOTArunning){ // se NON è in corso un aggiornamento OTA

                // Risolve il bug di servizio assente che si verificava in taluni casi quando mi ricollegano al bracciale dopo la carica
                if(!our_service_address || our_service_address == ""){
                    settings.isBTrunning = false;
                    binding_ph4();
                } else {
                    setTimeout(function(){
                        if(!settings.isBTrunning){
                            binding_ph4(); // mi connetto al dispositivo se non già connesso, rimango in attesa di allarmi
                        }
                    }, 500);
                }



                sync(); // Scarico impostazioni. Definito in sync.js
                clearInterval(settings.timer_sync);
                settings.timer_sync = setInterval(function(){ sync(); }, settings.time_sync); // ogni tot scarico dal server le impostazioni richiamando sync


                clearInterval(settings.timer_cron_alarm);
                settings.timer_cron_alarm = setInterval(cron_alarm, (settings.time_send_backup * 1000)); // Definita in cron.js

                // per uomo a terra
                /*
                if(settings.uat){
                    man_down(); // definita in file omonimo
                } else {
                    clearTimeout(settings.timer_alarm_watchId);
                    navigator.accelerometer.clearWatch(settings.observer_watchID);
                    settings.data_watchId = [];
                }
                */

                verify_question();
            }
            
        } else {
            if(ls("maesafe_tenantId").toString() == "2"){
                $('#faq_content').html('Stai riscontrando problemi di accesso o difficoltà nell\'uso dell\'app?<br />Contattaci via email all\'indirizzo maestraleinformation@gmail.com');
            }

            updateBearer(); // definita in sync.js
            
            // emetto alarm che informa l'itente della necessità di associare un braccialetto.
            // Poichè su Android è necessario uscire dall'app durante la procedura di pairing (per accettare la connessione BT) non mostro 
            // l'alarm se sono già in pagina pairing!
            var page = $.mobile.activePage.attr('id');
            if(page != "pairing"){
                navigator.notification.alert("Come primo step devi configurare il tuo braccialetto Mae Safety.\r\nSegui le istruzioni a schermo", function () { }, 'BENVENUTO', 'Ok');
            }

            $("body").pagecontainer("change", "#pairing");

        }
        
    } else {
        // UNLOGGED
        $("body").pagecontainer("change", "#unlogged");
    }
}




// Aggiornamento token: Action = 6 POST
function sync(){
    //console.log("***** BREARER INVIATO Action 0:", ls("maesafe_authorizationBearer"));
    var json_data = { Action: 0, Tenant: parseInt(ls("maesafe_tenantId")) };
    //console.log("JSON SYNC INVIATO: " + JSON.stringify(json_data));
    var addr = server + 'hub';

    $.ajax({
        type: "POST",
        url: addr,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem("maesafe_authorizationBearer"));
        },
        contentType: "application/json",
        crossDomain: true,
        global: false,
        data: JSON.stringify(json_data),
        success: function (doc) {

            //console.log(JSON.stringify(doc));
            

            if(doc && doc.success && doc.success.toString() == "true" && doc.data){
                
                ls("maesafe_proximityMeasureEndpoint", doc.data.proximityMeasureEndpoint);
                ls("maesafe_temperatureMeasureEndpoint", doc.data.temperatureMeasureEndpoint);
                ls("maesafe_deviceSubscriptionEndpoint", doc.data.deviceSubscriptionEndpoint);
                ls("maesafe_survey", doc.data.survey.toString());
                ls("maesafe_token_sso", doc.data.token);
                ls("maesafe_webPortalUrl", doc.data.webPortalUrl);
            }


            // se non c'è un braccialetto nei device, mi scollego dall'eventuale bracciale accoppiato con l'app (probabilmente mi hanno dissociato il bracciale da back-end)
            if(doc && doc.data && doc.data.devices && ls("maesafe_bt_mac") && ls("maesafe_bt_mac") != ""){
                var braceletUid = "";
                $.each(doc.data.devices, function(k, v){
                    if(v.name == "BRACELET"){
                        braceletUid = v.bluetoothUid;
                    }
                });

                
                if(braceletUid == "" || braceletUid != ls("maesafe_bt_mac")){ // bracciale non più associato nel DB, serve nuovo pairing
                    ble.disconnect(ls("maesafe_bt_mac"), null, null);
                    ls("maesafe_bt_mac", "");
                    $('.debugDiv').empty();
                    pagination_log_unlog();
                }

                // Verifico formato stringa 
                if(braceletUid !== ""){
                    if(!check_format_string_bracelet(ls("maesafe_bt_mac"))){ // definita in accessory.js
                        return false;
                    }
                }
            }

            //alert(doc.data.itr)
            if(doc.data.itr) settings.itr = doc.data.itr;
            if(doc.data.sad) settings.sad = ("0" + doc.data.sad.toString()).slice(-3);
            if(doc.data.sat) settings.sat = ("0" + doc.data.sat.toString()).slice(-3);
            if(doc.data.sda) {  // adatto i valori di SDA
                switch(doc.data.sda.toString()){
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
            if(doc.data.std) settings.std = doc.data.std;
            if(doc.data.sta) settings.sta = doc.data.sta;
            if(doc.data.trt) settings.trt = doc.data.trt;
            if(doc.data.sbr) settings.sbr = doc.data.sbr;
            if(doc.data.wut) settings.wut = doc.data.wut;
            if(doc.data.mav) settings.mav = doc.data.mav;
            if(doc.data.mtu) settings.mtu = doc.data.mtu;
            if(doc.data.ira) settings.ira = doc.data.ira;
            if(doc.data.tad) settings.tempAdjust = doc.data.tad;
            if(doc.data.csr) settings.csr = doc.data.csr;
            //if(doc.data.rbt) settings.rbt = doc.data.rbt;

            /*
            if(doc.data.uat) settings.uat = doc.data.uat;
            if(doc.data.dut) settings.dut = doc.data.dut;
            if(doc.data.rut) settings.rut = doc.data.rut;
            */

            // Verifica versione App
            if(settings.mav && settings.mav != ""){
                var versione_locale = settings.app_version.toString().split('.');
                var versione_minima = settings.mav.toString().split('.');

                if(parseInt(versione_locale[0]) < parseInt(versione_minima[0]) || parseInt(versione_locale[1]) < parseInt(versione_minima[1])){
                    // necessario aggiornare l'app
                    $("body").pagecontainer("change", "#aggiorna");
                } else if(parseInt(versione_locale[2]) < parseInt(versione_minima[2])){
                    window.plugins.toast.showWithOptions({ message: lang.app.sync.new_app_version /*'E\' disponibile una nuova versione dell\'app.'*/, duration: "long", position: "bottom", addPixelsY: -40 });
                }
            }

            // Imposto quali grandezze monitorare
            var arr_itr = settings.itr.toString().split('');
            ls("maesafe_use_temp", true);
            if(arr_itr[0] == "0") { // Non monitoro temperatura
                ls("maesafe_use_temp", false);
                $('#temp_row').hide();
            }
            ls("maesafe_use_prox", true);
            if(arr_itr[1] == "0") { // Non monitoro prossimità
                ls("maesafe_use_prox", false);
                $('#prox_row').hide();
            }

            //console.log('Valore TRT dal server = ' + settings.trt);
            //alert("TRT=" + settings.trt);
            //alert("ITR=" + settings.itr);

            


            // Scrivo le nuove impostazioni nel braccialetto
            update_bracelet_post_sync();

            verify_question();
        },
        error: function (xhr) {
            //console.log("ERRORE SYNC: " + JSON.stringify(xhr));
            if(xhr.status.toString() === "401"){ // caso particolare: token Bearer scaduto, necessario nuovo login 
                navigator.notification.alert(lang.app.sync.need_new_login /*"Devi effettuare nuovamente l'accesso."*/, function () {
                    completeLogout();
                }, lang.app.sync.sessione_exp /*'SESSIONE SCADUTA'*/, lang.app.ok);
                
            } else {
                window.plugins.toast.showWithOptions({ message: lang.app.sync.recovery_error /*'Errore recupero dati'*/, duration: "long", position: "bottom", addPixelsY: -40 });
            }
        }
    });


    // Aggiorno il token Bearer
    updateBearer();

}



// Scrivo le nuove impostazioni nel braccialetto
function update_bracelet_post_sync(){
    if(settings.isTalking || !settings.isBTrunning){
        // C'è già una comunicazione in corso con il bracciale. Evito di sovrapporle!
        setTimeout(update_bracelet_post_sync, 14000);  // 14 secondi
        return false; 
    }

    $('.debugDiv').empty();
    //debugLog("Intervalo SYNC (minuti):" + parseInt(settings.time_sync / 60000), "");
    console.log("PROGRAMMAZIONE IN CORSO - FLUSSO POST SYNC");
    debugLog("Programmazione braccialetto post sync col server", "");
    is_connected_Promise()
    .then(function(){
        return mi_sad_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_sad_read_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_sat_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_sda_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_std_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_sta_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_trt_Promise()
    })
    .then(function(){
        return waitPromise(settings.waitBetweenCommands) // intervallo tra un comando e il successivo
    })
    .then(function(){
        return mi_tst_Promise()
    })
    .then(function(){
        debugLog("Programmazione post-sync terminata con successo", "");
        setTimeout(check_fw_update(false), 500); // verifico diponibilità di aggiornamenti firmware
    })
    .catch(function(esito){
        debugLog("Errore Programmazione post-sync: " + esito, "error");
    });
}




// Aggiornamento del Bearer (durata 30 giorni)
function updateBearer(){
    var json_data = { Action: 6, Tenant: parseInt(ls("maesafe_tenantId")), Message: 30 };
    //console.log("AGGIORNAMENTO BEARER - JSON Inviato: " + JSON.stringify(json_data));
    //console.log("***** BREARER INVIATO Action 6:", ls("maesafe_authorizationBearer"))
    var addr = server + 'hub';
    //console.log(addr);

    $.ajax({
        type: "POST",
        url: addr,
        dataType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem("maesafe_authorizationBearer"));
        },
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify(json_data),
        success: function (doc) {
            //console.log('BREARER AGGIORNATO: ' + doc.data);
            //console.log(JSON.stringify(doc));
            if(doc && typeof doc == 'object' && doc.success.toString() == "true" && doc.data && doc.data != "" && doc.data != "Bearer"){
                ls("maesafe_authorizationBearer", doc.data);
            } else {
                console.log('Fallito aggiornamento Bearer per dato non conforme!');
            }

        },
        error: function (xhr) {
            console.log("Errore aggiornamento Bearer: " + JSON.stringify(xhr));
            return false;
        }
    });
}
/* POWERED BY DANIELE PELLERUCCI for MAESTRALE INFORMATION TECHNOLOGY */
/*
ACTION
settings        0 GET / 1POST
manDown	        2 POST
temperature     3 POST
proximity       4 POST
device          5 POST
refreshToken    6 POST
checkFWupdate   7 POST

api/v2/hub
api/v2/login
*/

// VARIABILI GLOBALI 
var inDebug =  true;
var settings = {};
var store = {};



// in settings memorizzo le sole costanti o le informazioni direttamente ricavabili dai plugin di cordova.
// le informazioni provenienti dal db sono memorizzate in localStorage
settings.app_version = "";                      // versione dell'app, usata per forzare l'upload
settings.server_real = "https://hw.teamsystemhr.com/api/v2/";           // server di produzione
settings.server_debug = "https://maesafety-dev.maestrale.it/api/v2/";   // server di test

var server = (inDebug) ? settings.server_debug : settings.server_real;



/*
var interval_token; // la uso in notifiche_push.js
var token; // memorizza il token delle notifiche push
var dispositivo;
var versione_os; // usata in notifiche.js
var phone_info = '';
*/




// LOCAL STORAGE
// maesafe_settings
// maesafe_id
// maesafe_fullName
// maesafe_tenantId
// maesafe_tenantName
// maesafe_role
// maesafe_authorizationBearer
// maesafe_authToken // per chiamate api

// maesafe_token // per notifiche push
// maesafe_dispositivo




function onLoad(){
  document.addEventListener("deviceready", onDeviceReady, false);
}



function onDeviceReady () {
    $(document).ready(function() {
        
        // mostro/nascondo elementi se in debug/produzione
        if(inDebug){ 

        } else {
            // in produzione elimino i log
            var console = {};    
            console.log = function(){};
            window.console = console;
        }

        //Predispongo la visualizzazione del loader quando eseguo chiamate ajax
        $(document).on({
            ajaxStart: function () { $(".loader").show(); },
            ajaxStop: function () { $(".loader").hide(); }
        });

        // LISTENER
        document.addEventListener("backbutton", onBackKeyDown, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("pause", onPause, false);

        

        // ricavo informazioni sul dispositivo utilizzato
        phone_info = device.manufacturer + ' - ' + device.model;


        // Versione app
        cordova.getAppVersion.getVersionNumber().then(function (version) {
            settings.app_version = version;
            $('.version').text('MAE PODOS v. ' + version + ((inDebug)? ' D' : ' P'));
        });

        

        // Avvio le notifiche push
        //setTimeout(function () { push_init(); }, 1000);


        pagination_log_unlog(); // definita in login.js
        
        navigator.splashscreen.hide();

    }); // fine document ready
} // fine onDeviceReady






function onResume() {
    // Verifico se sono in pagina di blocco
    var page = $.mobile.activePage.attr('id');
    if(page == 'block'){
        return false;
    }

    $('.debugDiv').empty();

    pagination_log_unlog(); // definita in login.js
    
    // riavvio le notifiche per aggiornare il token
    //setTimeout(function () { push_init(); }, 1000);

    
} // fine onResume




function onPause() {
}




// Pressione pulsante indietro (Android)
function onBackKeyDown(e) {
    $(".loader").hide();

    var page = $.mobile.activePage.attr('id');
    if ($(".ui-page-active .ui-popup-active").length > 0) { //c'è un popup aperto, lo chiudo!
        $('[data-role="popup"]').popup().popup("close");

    } else if (page == 'aggiorna' || page == 'unlogged' || page == 'block') {
        e.preventDefault();
        return false;

    } else if (page == 'logged') {
        e.preventDefault();
        return false;

    } else {
        window.history.back(); //restore normal back button functionality
    }
}
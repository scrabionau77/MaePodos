/** SIDE BAR **/
//Copyright Daniele Pellerucci


/** DISEGNO IL PANNELLO LATERALE IN TUTTE LE PAGINE **/
jQuery('.sidebar_zone').empty();
var pagine = $('div[data-role="page"]');
$.each(pagine, function(index, value){
    // per ciascuna pagina, modifico il link alla sidebar --> uso id univoco
    var $this = $(this);
    var page_id = $this.attr('id');
    $this.find('.toggle_sidebar').attr('href', '#sidebar_'+page_id);

    var i = '<div data-role="panel" id="sidebar_'+page_id+'" data-display="overlay" class="sidebar" data-theme="none" style="border-right: 1px solid #f3f3f3; background: #ffffff;">'
            +'<div class="sidebar_header">'
                +'<div style="padding: 5px;"><div class="sidebar_header_sigla"></div></div>' // iniziali
                +'<p class="sidebar_head_user rif_user_full_name">NOME COGNOME</p>'
                +'<p class="rif_nome_azienda sidebar_head_tenant">AZIENDA</p>'
            +'</div>'
            +'<ul data-role="listview" style="margin-bottom:2.5em !important;">'
                // HOME
                +'<li data-icon="false"> <a class="sidebar_home" href="#logged"> <i class="fa fa-home fa-fw green"></i>Home</a></li>'
                
                // IMPOSTAZIONI
                +'<li data-icon="false" class="menu-item-has-children">'
                    +'<a href="#pairing"><i class="fa fa-sliders fa-fw green"></i>Impostazioni</a>'
                    +'<div class="sidebar-down-label"><i class="fa fa-angle-double-down"></i></div>'
                    // Sub-menù impostazioni
                    +'<ul data-role="listview" class="sub-menu" style="background: #ffffff;">'
                        // Setup allarmi
                        +'<li style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#alarms"> <i class="fa fa-caret-right fa-fw"></i>Allarmi</a>'
                        +'</li>'
                       // Ruota schermo
                        +'<li style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#" class="sidebar_odo"> <i class="fa fa-caret-right fa-fw"></i>Ruota schermo</a>'
                        +'</li>'
                    +'</ul>'
                +'</li>'

                // UTILITY
                +'<li data-icon="false" class="menu-item-has-children">'
                    +'<a href="#pairing"><i class="fa fa-gear fa-fw green"></i>Utility</a>'
                    +'<div class="sidebar-down-label"><i class="fa fa-angle-double-down"></i></div>'
                    // Sub-menù impostazioni
                    +'<ul data-role="listview" class="sub-menu" style="background: #ffffff;">'
                        // Trova bracciale
                        +'<li style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#" class="sidebar_findBra"> <i class="fa fa-caret-right fa-fw"></i>Trova bracciale</a>'
                        +'</li>'
                        // Aggiorna bracciale
                        +'<li style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#" class="updFwBracelet"> <i class="fa fa-caret-right fa-fw"></i>Aggiorna bracciale</a>'
                        +'</li>'
                        // Info dispositivo
                        +'<li style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#infoDisp"> <i class="fa fa-caret-right fa-fw"></i>Info bracciale</a>'
                        +'</li>'
                        // DEBUG (non visibile in Produzione)
                        +'<li class="debugMenu" style="padding: 0.5em 0;" data-icon="false">'
                            +'<a href="#debug" style="color: red;"> <i class="fa fa-caret-right fa-fw"></i>Test comandi</a>'
                        +'</li>'
                    +'</ul>'
                +'</li>'
                // FAQ
                +'<li data-icon="false"> <a class="faq" href="#faq"> <i class="fa fa-info-circle fa-fw green"></i>Faq</a></li>'
                // QUESTIONARI
                +'<li data-icon="false"> <a class="questions" href="#"> <i class="fa fa-question-circle fa-fw green"></i>Questionari</a></li>'
                
               +'<li data-icon="false"> <a class="logInOut" href="#home"> <i class="fa fa-sign-out fa-fw green"></i>Log-out</a></li>'
            +'</ul>'
            +'<br /><p style="text-align: left;"><small class="version" style="color: #bbbbbb; font-size: 10px;"></small></p>'
        +'</div>';

        $this.find('.sidebar_zone').empty().html(i);
});



$.each(pagine, function(index, value){
    // per ciascuna pagina, modifico il link alla sidebar --> uso id univoco
    var $this = $(this);
    var page_id = $this.attr('id');
    $this.find('.toggle_sidebar').find('ul').listview().listview('refresh');

});
$('[data-role="panel"]').panel();

/** FOOTER ZONE **/
//Copyright Daniele Pellerucci



// Footer per tutte le pagine, esclusa la home
var i = '<div data-role="footer" data-position="fixed" data-border="false" data-tap-toggle="false">'
            +'<div data-role="navbar" style="background: #f0f0f0;">'
                +'<ul>'
                    +'<li><a class="foot_home" href="#home"><i class="fa fa-home fa-fw"></i><span>Home</span></a></li>'

                    +'<li><a class="foot_chat" href="#"><i class="fa fa-comments-o fa-fw"></i><span>Chat</span></a></li>'

                +'</ul>'
            +'</div>'
        +'</div>';

jQuery(".footer_zone").empty().html(i);



// Footer per la home
var i = '<div data-role="footer" data-position="fixed" data-border="false" data-tap-toggle="false">'

            +'<div data-role="navbar" style="background: #f0f0f0;">'
                +'<ul>'
                    +'<li><a class="foot_home" href="#home"><i class="fa fa-home fa-fw"></i><span>Home</span></a></li>'

                    +'<li ><a class="foot_log" href="#"><i class="fa fa-key fa-fw"></i><span class="area_utente_login">Login / Registrati</span></a></li>'

                    +'<li><a class="foot_chat" href="#"><i class="fa fa-comments-o fa-fw"></i><span>Chat</span></a></li>'

                +'</ul>'
            +'</div>'
        +'</div>';

jQuery('#home').find(".footer_zone").empty().html(i);





// Footer per la chat
var i = '<div data-role="footer" data-position="fixed" data-border="false" data-tap-toggle="false" style="background:#eee !important;">'

            +'<div style="position:relatve;">'

              +'<div id="testo_chat_container" style="padding-right:45px; padding-left:2px;">'
                +'<textarea id="testo_chat" data-corners="false" rows="1" ></textarea>'
              +'</div>'

              +'<div style="width:25px; position:absolute; bottom:40px; right:14px;">'
                +'<i id="invia_chat" data-id-giro="" class="fa fa-forward fa-3x" style="color:#e03631;"></i>'
              +'</div>'
            +'</div>'

            +'<div data-role="navbar" style="background: #f0f0f0;">'
                +'<ul>'
                    +'<li><a class="foot_home" href="#home"><i class="fa fa-home fa-fw"></i><span>Home</span></a></li>'
                    +'<li><a class="foot_info_chat" href="#"><i class="fa fa-info-circle fa-fw"></i><span>Info</span></a></li>'
                    +'<li><a class="foot_chat" href="#"><i class="fa fa-comments-o fa-fw"></i><span>Chat</span></a></li>'

                +'</ul>'
            +'</div>'
        +'</div>';

jQuery('#dettagli_chat').find(".footer_zone").empty().html(i);

/** TOP BAR **/
//Copyright Daniele Pellerucci

var i = '<div data-role="header" data-position="fixed" data-border="false" class="header-info-bar" data-tap-toggle="false">'
            +'<div data-role="navbar" style="background: #f0f0f0;">'
                +'<ul>'
                    +'<li><a href="#bk_home"><i class="fa fa-home fa-fw"></i><span class="bk_top_saluto">Benvenuto!</span></a></li>'
                    +'<li class="bk_top_log"><a href="#"><i class="fa fa-user fa-fw"></i><span class="bk_top_log_testo">Log in-out</span></a></li>'
                    +'<li class="bk_top_bdc"><a href="#"><i class="fa fa-motorcycle fa-fw"></i><span>BDC</span></a></li>'
                    +'<li class="bk_top_mtb"><a href="#"><i class="fa fa-bicycle fa-fw"></i><span>MTB</span></a></li>'
                +'</ul>'
            +'</div>'
        +'</div>';
            
jQuery(".topbar_zone").empty().html(i);         

//SOME NEEDED FUNCTIONS FOR BUTTONS
var alert = function(masaIndex){
	var $alert = $("#alert");
	$alert.children("p").html("<strong>" + masaIndex + " Numaralı Masayı Kapatmak İstediginizden Emin Misiniz ?" + "</strong>");
	$alert.removeClass("switch_off");
	$alert.addClass("switch_on");

}
//SOCKET BUSINESS

//Make soccet connection

var socket = io("/");

socket.on("aktif_siparis_listesi_update",function(data){
		$( "#aktif_siparis_listesi tbody").first().prepend(data)
		$("#aktif_siparis_listesi tbody tr").each(function(index){
						var orderIdNumber = $(this).attr("id")
						$(this).children().each(function(index){
							if(index === 6){
								$(this).first().click( function(){return handleOrderButton(orderIdNumber); } )
							}
						})
		})
})
//	VUE JS
var buttons = new Vue({
	el:"#buttons",
	data : {
	},
	methods:{
		activateMasalar : function(){
			$("#masalar").show()
			$("#aktif_siparis_listesi").hide()
		},
		activateAktifSiparisListesi : function(){
			$("#masalar").hide()
			$("#aktif_siparis_listesi").show()
		}
	}
})

var table_info = new Vue({
	el:"#table_info",
	data:{
		seenPHolder : true,
		seenCustomers : false,
	}
})

var tables = new Vue({
	el:"#tables",
	data:{
		show : false,
	},
	methods:{
					show_detail : function(index){
			console.log(index)
			$.post("/table_info",{table_index : index }, function(data , status){
				if(status === "success"){
					table_info.seenPHolder = false
					var $element = $("#table_info_container").html(data)
					 $("#customerSwitch").click(function(){
						$("#customerList").toggleClass("switch_off");
					})
				}

			})
		}
	}
})

var aktif_siparis_listesi = new Vue({
	el: "#aktif_siparis_listesi",
	data : {
		siparis_new_count : 0
	},
	methods:{

	}
})

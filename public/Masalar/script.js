//Make soccet connection

var socket = io("/");

var buttons = new Vue({
	el:"#buttons",
	data : {
	},
	methods:{
		activateMasalar : function(){
			console.log("activated masalar")
		},
		activateAktifSiparisListesi : function(){
			console.log("activated AktifSiparisListesi")
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


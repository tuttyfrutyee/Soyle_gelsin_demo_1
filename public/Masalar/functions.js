var turnDateStringIntoNumber = function(dateString){
  var leftNumberString = new String();
  var rightNumberString = new String();
  var doubleDotIndex = 0;

  for(var i = 0; i < dateString.length; i++){
    if(dateString.charAt(i) === ":"){
      doubleDotIndex = i;
      for(var j = 0; j < doubleDotIndex-1; j++){
        leftNumberString = leftNumberString.concat(dateString.charAt(j));
      }
      for(var k = doubleDotIndex+2 ; k < dateString.length ; k++){
        rightNumberString = rightNumberString.concat(dateString.charAt(k));
      }
    }
  }


  var leftNumber = Number(leftNumberString);
  var rightNumber = Number(rightNumberString);

  return leftNumber * 100 + rightNumber;

}


var handleOrderButton = function(orderId){
  //server returns updated deliveryState
  console.log("handleOrderButton Function has been called")
  $.post("/handle/orderButtons" ,{orderId : orderId}, function(data){
    if(data.success === "true"){
      var $allOrders = $("#aktif_siparis_listesi tbody tr")
      var $orderLine = $("#"+orderId);
      $orderLine.children().each(function(index){
        if(index === 5){
          switch(data.deliveryState){
            case "Bekliyor":
            //do nothing
            break;
            case "Alındı":
            console.log("alındı received wtf")
              var elementDateAsNumber = turnDateStringIntoNumber($orderLine.children().eq(4).text());
              var targetInsertIndex = -1;
              var found = false
              $allOrders.each(function(index){
                var currentDateAsNumber = turnDateStringIntoNumber($(this).children().eq(4).text());
                if($(this).children().eq(5).text() === "Alındı" && elementDateAsNumber < currentDateAsNumber && !found){
                  targetInsertIndex = index;
                  found = true;
                }
              })
              //changing all orders, the targetIndex will decrement one more(it was already - 1...)
              $orderLine.remove();
              //since orderList is changed getting new jquery object
              var $updatedAllOrderList = $("#aktif_siparis_listesi tbody");

              if(targetInsertIndex === -1){
                console.log("wtf")
                $updatedAllOrderList.append($orderLine);
              }else{
                console.log("hello baby")
                console.log(targetInsertIndex-2)
                //console.log($updatedAllOrderList.children(":nth-child("+(targetInsertIndex-2)+")"))
                $orderLine.insertAfter($updatedAllOrderList.children(":nth-child("+(targetInsertIndex-1)+")"))
              }
              $(this).text("Alındı");
              $(this).css("color","white")
              $(this).css("background-color" , "green");

              $orderLine.first().click(function(){return handleOrderButton(orderId)})
            break;
            case "Teslim Edildi":
              $orderLine.remove()
            break;
          }
        }
      else if(index === 6){
          switch(data.deliveryState){
            case "Bekliyor":
            break;
            case "Alındı":

              $(this).children(":first").text("Teslim Et");
              $(this).children(":first").removeClass("btn-primary");
              $(this).children(":first").addClass("btn-success")
            break;
            case "Teslim Edildi":
            //has been removed by the upper code
            break;
          }
        }
      })
    }else{
      console.log("Request was not successful")
    }
  })
}
// Yemek durumları : Bekleniyor , Alındı , Teslim Edildi

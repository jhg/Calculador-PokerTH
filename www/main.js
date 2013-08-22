var main = {};
main.oponentes = 1;
main.cartas = {"t1":{"c":0,"v":0},"t2":{"c":0,"v":0},
               "m1":{"c":0,"v":0},"m2":{"c":0,"v":0},
               "m3":{"c":0,"v":0},"m4":{"c":0,"v":0},
               "m5":{"c":0,"v":0}};

function recalcula(){
  // numero de cartas conocidas
  var conocidas = 0;
  for(var i in main.cartas){
    if (main.cartas[i]['c'] != 0) conocidas++;
  }
  // numero de cartas desconocidas
  var desconocidas = 52 - conocidas;
  var p_victoria = {};
  // victoria con carta alta
  p_victoria['carta_alta'] = porcentaje_victoria(cartas_favorables_carta_alta(
                                                   main.cartas['t1']['v'],
                                                   main.cartas['t2']['v']),
                               cartas_favorables_carta_alta(
                                                   main.cartas['t1']['v'],
                                                   main.cartas['t2']['v'])+
                               cartas_desfavorables_carta_alta(
                                                   main.cartas['t1']['v'],
                                                   main.cartas['t2']['v']));
  
  var text = "<b>Probabilidades</b><br/>";
  text += "Carta alta: "+p_victoria['carta_alta']+"%<br>"
  
  $("#pantalla").html(text);
}

function cuantas_en_mesa_v(c){
  var t = 0;
  for(var i in main.cartas){
    if (main.cartas[i]['v'] == c && i != "t1" && i != "t2") t++;
  }
  return t;
}

function cuantas_en_mano_v(c){
  var t = 0;
  for(var i in main.cartas){
    if (main.cartas[i]['v'] == c && i == "t1" && i == "t2") t++;
  }
  return t;
}

function cartas_favorables_carta_alta(t1, t2){
  var m = mayor(t1, t2);
  var f = ((m - 1) << 2);
  for(var i in main.cartas){
    if (main.cartas[i]['v'] < m && i != "t1" && i != "t2") f--;
  }
  if(t1 != t2) f--;
  if(f < 0) f=0;
  return f;
}

function cartas_desfavorables_carta_alta(t1, t2){
  var m = mayor(t1, t2);
  var f = ((13 - m) << 2) + 3;
  if(t1 == t2) f--;
  for(var i in main.cartas){
    if (main.cartas[i]['v'] >= m && i != "t1" && i != "t2") f--;
  }
  if(f < 0) f=0;
  return f;
}

function porcentaje_victoria(cartas_favorables, cartas_restantes){
  return (cartas_favorables / cartas_restantes) * 100;
}

function mayor(a, b){
  if(a > b) return a;
  return b;
}

function menor(a, b){
  if(a > b) return b;
  return a;
}

function valor_de(texto){
  if (texto == "A") return 13;
  if (texto == "2") return 1;
  if (texto == "3") return 2;
  if (texto == "4") return 3;
  if (texto == "5") return 4;
  if (texto == "6") return 5;
  if (texto == "7") return 6;
  if (texto == "8") return 7;
  if (texto == "9") return 8;
  if (texto == "10") return 9;
  if (texto == "J") return 10;
  if (texto == "Q") return 11;
  if (texto == "K") return 12;
  return 0;
}

function texto_de(n){
  if (n == 13) return "A";
  if (n == 1) return "2";
  if (n == 2) return "3";
  if (n == 3) return "4";
  if (n == 4) return "5";
  if (n == 5) return "6";
  if (n == 6) return "7";
  if (n == 7) return "8";
  if (n == 8) return "9";
  if (n == 9) return "10";
  if (n == 10) return "J";
  if (n == 11) return "Q";
  if (n == 12) return "K";
  return "";
}

function escoge_carta(f){
  $("#selecciona-carta").css("display", "block");
  $("#selecciona-carta > div").click(function(){
    $("#selecciona-carta").css("display", "none");
    if (f) f(this.id);
  });
}

function de_dorso(){
  main.a_escoger = $(this);
  escoge_carta(function(c){
    main.a_escoger.removeClass();
    main.a_escoger.addClass("carta");
    main.a_escoger.addClass("c"+c[0]);
    main.a_escoger.addClass("c"+c.slice(1));
    main.a_escoger.data("carta", c);
    main.a_escoger.off("click");
    main.a_escoger.click(de_cara);
    main.cartas[main.a_escoger.attr('id')]['c'] = c[0];
    main.cartas[main.a_escoger.attr('id')]['v'] = valor_de(c.slice(1));
    recalcula();
  });
}

function de_cara(){
  $(this).removeClass().removeData("carta")
  .addClass("carta").addClass("carta-dorso")
  .off("click").click(de_dorso);
  main.cartas[$(this).attr('id')]['c'] = 0;
  main.cartas[$(this).attr('id')]['v'] = 0;
  recalcula();
}

function interfaz(){
  $(".carta-dorso").click(de_dorso);
  $("#oponentes").on("change",function(){
    main.oponentes = this.value;
    recalcula();
  });
  $("#reiniciar").on('click', function(){
    $("#tuyas .carta").not(".carta-dorso").trigger('click');
    $("#mesa .carta").not(".carta-dorso").trigger('click');
  });
  recalcula();
}

$(document).ready(interfaz);


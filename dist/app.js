var playerSymbol;
var enemySymbol;
var win; // True jika terdapat pemenang
var turn = 0; // hitung giliran yang sedang berlangsung
var row, column; // "koordinat" untuk sel tertentu
var defaultMode;
var cpuEnabled;

$(document).ready(function () {
  // Menginisialisasi simbol player
  playerSymbol = "x";
  enemySymbol = "o";
  let player = [];

  $("#p1").on('blur', function () {
    const p1 = $(this).val();
    if (p1 != "") {
      player.push(p1);
      $(".giliran").html("Giliran " + $("#p1").val() + " (X)");
    } 
  });

  $("#p2").on('blur', function () {
    const p2 = $(this).val();
    if (p2 != "") {
      player.push(p2);
    }
  });

  // mereset game saat tombol restart di klik
  $("#restart").on("click", function () {
    // restartGame();
    if (!$(this).hasClass('disabled')) {
      window.location.reload();
    }
  });

  $('#pilih_mode').on('change',function () {
    if ($(this).val() == "cpu") {
      window.location = "./humanvscpu.html";
    }
  })

  // Event saat elemen cell di klik
  $(".kolom").on("click", function () {
    // Jika belum ada yang menang dan sel yang diklik kosong
    if (player.length < 2) {
      alert("Silahkan isikan nama Player !!!");
    }else{
      if (!win && this.innerHTML === "") {
        if (turn % 2 === 0) {
          $(".giliran").html("Giliran " + $("#p2").val() + " (" + enemySymbol + ")");
          tampilSimbol(this, playerSymbol);
        } else {
          $(".giliran").html("Giliran " + $("#p1").val() + " (" + playerSymbol + ")");
          tampilSimbol(this, enemySymbol);
        }
      }
    }
  });
});


/******  FUNCTIONS  ******/

// Menyisipkan simbol di sel yang diklik
function tampilSimbol(element, symbol) {
  element.innerHTML = symbol;

  // if (symbol === enemySymbol)
  $("#" + element.id).addClass(symbol); // Membedakan warna simbol musuh atau Player 2
  // $("#" + element.id).addClass("nonAktif"); // Tampilkan kursor "nonaktif" pada sel yang sudah ditempati

  cekPemenang(element);
  turn++;
  // Akhir permainan - Jika seseorang menang atau semua sel terisi
  if (win || turn > 8) {
    
    if(win){
      $("#restart").removeClass("disabled"); // Hapus class "disabled"
      $("#restart").addClass("btn-green"); // Highlights tombol "restart"
      var pemenang = symbol == "x" ? $("#p1").val() + " (X)" : $("#p2").val() + " (O)";
      $(".giliran").html("Selamat " + pemenang + " anda adalah pemenang !!!");
    }else{
      $("#restart").removeClass("disabled"); // Hapus class "disabled"
      $("#restart").addClass("btn-green"); // Highlights tombol "restart"
      $(".giliran").html("Draw !!!");
    }
  }
}

/* Periksa apakah ada kombinasi yang menang di kisi (3 simbol sama dalam satu baris / kolom / diagonal)*/
function cekPemenang(element) {
  // Ambil koordinat sel dari id tombol yang diklik
  row = element.id[4];
  column = element.id[5];

  // 1) VERTIKAL (periksa apakah semua simbol di kolom sel yang diklik adalah sama)
  win = true;
  for (var i = 0; i < 3; i++) {
    // console.log($("#cell" + i + column).hasClass("x"));
    if ($("#cell" + i + column).text() !== element.innerHTML) {
      win = false;
    }
  }
  if (win) {
      setTimeout(() => {
        $("#board").addClass(`V${parseInt(column,10)+1} full`);
      }, 50);
      return; // Keluar dari fungsi, untuk mencegah "menang" disetel ke false oleh cek lain
  }

  // 2) HORIZONTAL (periksa baris sel yang diklik)

  win = true;
  for (var i = 0; i < 3; i++) {
    if ($("#cell" + row + i).text() !== element.innerHTML) {
      win = false;
    }
  }
  if (win) {
    for (var i = 0; i < 3; i++) {
      $("#board").addClass(`H${parseInt(row,10)+1} full`);
    }
    return;
  }

  // 3) DIAGONAL UTAMA (demi kesederhanaan, memeriksa bahkan jika sel yang diklik tidak berada di diagonal utama)

  win = true;
  for (var i = 0; i < 3; i++) {
    if ($("#cell" + i + i).text() !== element.innerHTML) {
      win = false;
    }
  }
  if (win) {
    for (var i = 0; i < 3; i++) {
      $("#board").addClass("D1 full");
    }
    return;
  }

  // 3) DIAGONAL KEDUA

  win = false;
  if ($("#cell02").text() === element.innerHTML) {
    if ($("#cell11").text() === element.innerHTML) {
      if ($("#cell20").text() === element.innerHTML) {
        win = true;
        $("#board").addClass("D2 full");
      }
    }
  }
}
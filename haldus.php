<?php
header('Content-Type: aplication/json; charset=utf-8');
// Fail peab olema veebiserveri kasutaja jaoks kirjutatav
$baas = 'andmebaas.txt';

if ( file_exists($baas)){
// loeme faili sisu tekstina muutujasse
$andmebaas = file_get_contents($baas);
// deserialiseerime teksti JSON formaadist masiiviks
$andmebaas = json_decode($andmebaas, true);
} else{
    $andmebaas = array();
}
// järgneva käivitame ainult POST päringu korral
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    if (isset($_POST['kustuta'])) { // kontrollime kas vormis oli väli nimega "kustuta"

        // eemaldame valitud indeksiga elemendi massiivist
        $kustuta = intval($_POST['kustuta']);
        $uus_andmebaas = array();
        foreach($andmebaas as $index => $rida){
            if($index !=$kustuta){
                $uus_andmebaas[] = $rida;
            }
        }
      $andmebaas = $uus_andmebaas;
    } else {
            
        if( !empty($_POST['nimetus'])){
             $nimetus = $_POST['nimetus'];
        }else{
             $nimetus = '';
        }
       if( !empty($_POST['kogus'])){
        $kogus = intval($_POST['kogus']);
       }else{
           $kogus=0;
       }
        // kontrollime kas sisendväärtused on oodatud kujul või mitte
        if ($nimetus == '' || $kogus <= 0) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode(array(
                'error' =>'Vigased väärtused!'
                ));
            exit;
        }

        // lisame kirje "andmebaasi", st. et lisame massiivi uue indeksi koos vormi andmetega
        $andmebaas[] = array(
            'nimetus' => $nimetus,
            'kogus' => $kogus,
        );
    }

    // salvestame muudetud massiivi
    // kõigepealt serialiseerime massiivi JSON stringiks
    $andmebaas = json_encode($andmebaas);
    // salvestame serialiseeritud stringi andmebaasifaili
    file_put_contents($baas, $andmebaas);
echo $andmebaas;
   
}else{
    echo json_encode($andmebaas);
}

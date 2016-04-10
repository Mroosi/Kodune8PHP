/* eslint-env browser */
'use strict';

/*
Seame nupule "Kuva lisamise vorm" sündmuse "click" halduri, mis peidab "kuva-nupp" paragrahvi,
aga toob nähtavale "lisa-vorm" form elemendi
*/
document.querySelector('#kuva-nupp button').addEventListener('click',
    /**
     * Funktsioon teeb vormi nähtavaks ning peidab "peida" nupu
     * @event
     */
    function () {
        document.getElementById('lisa-vorm').style.display = 'block';
        document.getElementById('kuva-nupp').style.display = 'none';
    });

/*
Seame nupule "Peida lisamise vorm" sündmuse "click" halduri, mis teeb "kuva-nupp"
paragrahvi nähtavaks, aga peidab "lisa-vorm" form elemendi
*/
document.querySelector('#peida-nupp button').addEventListener('click',
    /**
     * Funktsioon peidab vormi ning teeb nähtavaks "peida" nupu
     * @event
     */
    function () {
        document.getElementById('lisa-vorm').style.display = 'none';
        document.getElementById('kuva-nupp').style.display = 'block';
    });

/*
Lisame vormielemendile "lisa-vorm" sündmuse "submit" halduri, mis ilmeb siis kui kasutaja
kas klikib vormis asuval submit nupul või vajutab tekstikastis enter klahvi.
*/
document.getElementById('lisa-vorm').addEventListener('submit',
    /**
     * Käivitatakse vormi postitamisel. Kontrollib vormis olevaid väärtusi ja lisab
     * laotabelisse uue rea valitud väärtusega
     * @event
     * @param  {Event} event Sündmuse info
     */
    function (event) {
        // Katkestame tavalise submit tegevuse, vastasel korral navigeeriks brauser mujale
        event.preventDefault();

        // loeme tekstikastidest kasutaja sisestatud andmed
        var nimetus = document.getElementById('nimetus').value;
        var kogus = Number(document.getElementById('kogus').value);

        // kontrollime väärtuseid
        if (!nimetus || kogus <= 0) {
            alert('Vigased väärtused!');
            return;
        }
        
        fetch('haldus.php', {
            method: 'post',
            body: new FormData(document.getElementById('lisa-vorm'))
        }).then(function(res){
            if(res.ok){
                return res.json();
            }else{
                throw new Error('Vigane päring');
            }
            
        }).then(function(data){
                  
                document.getElementById('nimetus').value = '';
                document.getElementById('kogus').value = '';
                document.querySelector('#ladu tbody').innerHTML='';
                for (var i = 0; i < data.length; i++) {
                     lisaRida(data[i].nimetus, data[i].kogus, i);
                }
                // kutsume välja uue tabeli rea lisamise funktsiooni
        
        }).catch(function(err) {
            alert('Ilmnes viga: ' + err.message);
        })
            
        });
/**
 * Funktsioon lisab laovaate tabelisse uue rea nimetuse,
 * koguse ja sama rea kustutamise nupuga
 * @param  {String} nimetus Kasutaja sisestatud artikli nimetus
 * @param  {String} kogus   Kasutaja sisestatud artikli kogus
 */
function lisaRida(nimetus, kogus, index) {

    // Loome vajalikud DOM elemendid, millest rida kokku panna
    var rida = document.createElement('tr'); // <tr></tr>
    var tdNimetus = document.createElement('td'); // <td></td>
    var tdKogus = document.createElement('td');
    var tdTegevused = document.createElement('td');
    var kustutaNupp = document.createElement('input');

    // Seame tekstiväärtused vastavate lahtrite tekstiliseks sisuks
    tdNimetus.textContent = nimetus; // <td>Külmkapp</td>
    tdKogus.textContent = kogus;

    // Muudame kustutamise nuppu, seame sellele "type" ning "value" väärtused
    kustutaNupp.setAttribute('type', 'button');
    kustutaNupp.value = 'Kustuta rida';

    // Lisame nupu elemendi tegevuste lahtrisse
    tdTegevused.appendChild(kustutaNupp); // <td><input type="button" value="Kustuta rida"></td>

    // Moodustame eraldiseisvatest lahtritest ühe tervikliku rea
    rida.appendChild(tdNimetus); // <tr><td>Külmkapp</td></tr>
    rida.appendChild(tdKogus);
    rida.appendChild(tdTegevused);

    // lisame rea lehel olevasse tabelisse
    document.querySelector('#ladu tbody').appendChild(rida); // <tbody><tr><td>Külmkapp</td></tr></tbody>


    kustutaNupp.addEventListener('click',
        /**
         * Käivitatakse "kustuta" nupul klikkimisel. Kustutab laotabelist varem lisatud rea
         * @event
         */
        function () {
            if (confirm('Kas oled kindel')) {
                rida.parentNode.removeChild(rida);
            }
        });
}
<?php
$valid_passwords = array ("giant" => "app");
$valid_users = array_keys($valid_passwords);

$user = $_SERVER['PHP_AUTH_USER'];
$pass = $_SERVER['PHP_AUTH_PW'];

$validated = (in_array($user, $valid_users)) && ($pass == $valid_passwords[$user]);

if (!$validated) {
  header('WWW-Authenticate: Basic realm="Dev"');
  header('HTTP/1.0 401 Unauthorized');
  die ("Not authorized");
}

//si c'est une inscription mail
if (isset($_POST['inputmail'])) {
    $file = fopen("emails.csv", "w");
    fputcsv($file, array($_POST['check-box-vendeur'] , $_POST['inputmail']));
}
//si c'est un formulaire QUESTION
if (isset($_POST['form-mail'])) {
    $file = fopen("emails.csv", "w");
    fputcsv($file, '0' . $_POST['input-mail'] . ',' . $_POST['name'] . ',' . $_POST['question']);
    //mail();
}
?>
<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
    <head>
        <title>Paces-Store</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/font-awesome.min.css">
        <link rel="stylesheet" href="css/override.css">
        <link rel="stylesheet" href="css/animate.css">
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script type="text/javascript" src="js/ketchup.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/animate.js"></script>
        <script type="text/javascript" src="js/flowtype.js"></script>
        <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300ita‌​lic,400italic,500,500italic,700,700italic,900italic,900' rel='stylesheet' type='text/css'>
        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-55970631-1', 'auto');
            ga('send', 'pageview');

        </script>
        <meta name="google-site-verification" content="hIfrtfmDJXM5vy7BkFSyYpxPlUFfVLp2F8jcbcMztls" />
    </head>
    <body>
        <div id="home" class="section dark transparent text-center row">
            <div class="section-inner">
                <div class="col-md-1"></div>
                <div class="col-md-10">
                    <h1>Découvrez une toute nouvelle façon de travailler</h1>
                </div>
                <div class="col-md-1"></div>
                <img class="logo-paces-store" src="img/Logo-PACES-Store.png" alt="PACES Store"/>
                <p class="p-logo-rmp text-center">Par <img class="logo-rmp" src="img/Logo-RMP-PACES-STORE.png" alt="PACES Store"/></p>
            </div>
        </div>

        <!-- SIGNUP ! -->
        <div class="signup-row colored-row row">
            <div class="col-md-12">
                <form class='form-inline newsletter-form' action="#" method="POST" role="form" name="form-mail">
                    <div class="row text-center">
                        <h3>Je suis intéressé(e) ?</h3>
                        <br/>
                        <input type='email' class="form-control input-lg" id="inputmail" name="inputmail" placeholder="Mon adresse mail" required/>
                        <input type='submit' class="btn btn-lg btn-warning" value="Je m'inscris">
                    </div>
                    <div class="row box-vendeur">
                        <input type='checkbox' class="checkbox-inline" name="check-box-vendeur" value='1' id="check-box-vendeur"> 
                        <label for="check-box-vendeur" class="control-label">Je souhaite être vendeur</label>
                    </div>
                </form>
            </div>
        </div>

        <!-- CONTENT ROW 1 -->
        <div id="content-row-1" class="visibility-hidden content-row">
            <div class="row">
                <div class="col-md-12">
                    <div class="col-md-2"></div>
                    <div class="col-md-8">
                        <h3>La première plateforme de travail par et pour les étudiants</h3>
                        <div class="row vcenter">
                            <div id="lightbulb" class="col-md-2">
                                <img src="img/rocket70.png" alt="nice idea"/>
                            </div>
                            <div class="col-md-10">
                                <p>
                                    <b>PACES Store</b> est la première plateforme collaborative et participative de travail, entièrement dédiée à la réussite de la PACES. 
                                </p>
                                <p>
                                    <b>PACES Store</b> simplifie l’entre-aide et la transmission de savoir-faire entre les étudiants ayant réussi les concours et les étudiants en PACES. Les premiers participent à la réussite des seconds.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-2"></div>
                </div>
            </div>
        </div>

        <!-- CONTENT ROW 2 -->
        <div id="content-row-2" class="content-row alter-colored-row visibility-hidden">
            <div class="row">
                <div class="col-md-12">
                    <div class="col-md-2"></div>
                    <div class="col-md-8">
                        <h3 class="text-center">
                            <i class="fa fa-quote-left fa-lg"></i><i> Avant, s’entrainer à faire des colles, exercices, fiches etc. était couteux ou répétitif. Mais ça, c’était avant <b>PACES Store</b> ! <i class="fa fa-quote-right fa-lg"></i></i>
                        </h3>
                    </div>
                    <div class="col-md-2"></div>
                </div>
            </div>
        </div>


        <!-- CONTENT ROW 3 -->
        <div id="content-row-3" class="content-row row visibility-hidden">
            <div class="col-md-12">
                <div class="col-md-2"></div>
                <div class="col-md-8">
                    <h3 class="text-center">Aussi simple que bonjour</h3>
                    <!--<p>
                        <b>PACES Store</b> fonctionne très simplement : les étudiants ayant réussi la PACES, proposent  leurs colles, exercices, fiches cours etc qu’ils auront préalablebement rédigés, aux étudiants en PACES de leur université. C’est aussi simple que cela. C’est le complément qu’il manquait aux tutorats et aux prépas privées.
                    </p>-->
                    <p class="text-center">
                        <img id="schema" src="img/PACES-Store-schema.png"/>
                    </p>

                </div>
                <div class="col-md-2"></div>
            </div>
        </div>

        <!-- CONTENT ROW 4 -->
        <div id="content-row-4" class="content-row alter-colored-row row visibility-hidden">
            <div class="col-md-12">
                <div class="row">
                    <div class="col-md-2"></div>
                    <div class="col-md-8">
                        <h3 class="text-center" id="qui-sommes-nous">Qui sommes-nous ?</h3>
                        <p class="text-center">Elaboré avec <i class="fa fa-heart"></i> par l'équipe de référence en PACES :</p>
                        <p class="p-logo-rmp text-center"><img class="logo-rmp logo-rmp-colored" src="img/Logo-RMP-PACES-STORE-COLORED.png" alt="PACES Store"/></p>
                    </div>
                    <div class="col-md-2"></div>
                </div>
            </div>
        </div>


        <!-- SIGNUP ! -->
        <div class="signup-row colored-row row">
            <div class="col-md-12">
                <form class='form-inline newsletter-form'>
                    <div class="row text-center">
                        <h3>Intéressé(e) et envie d’en savoir encore plus ?</h3>
                        <br/>
                        <input type='email' class="form-control input-lg" id="inputmail" placeholder="Mon adresse mail" />
                        <input type='submit' class="btn btn-lg btn-warning" value="Je m'inscris">
                    </div>
                    <div class="row box-vendeur">
                        <input type='checkbox' class="checkbox-inline" value='1' id="check-box-vendeur"> 
                        <label for="check-box-vendeur" class="control-label">Je souhaite être vendeur</label>
                    </div>
                </form>
            </div>
        </div>

        <!-- CONTACT US -->
        <div id="contact-row" class="content-row row">
            <div class="col-md-12">
                <h3>Une question ? On est là pour ça <i class="fa fa-smile-o"></i></h3>
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <form name="contact-form" role="form" action="#" method="POST" name="form-question">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <input type="text" class="form-control" name="name" value="Mon nom et prénom" required/>
                            </div>
                            <div class="col-md-6">
                                <input type="email" class="form-control" name="inputmail" value="Mon adresse mail" required />
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" name="question" rows="8" required>Ma question</textarea>
                        </div>
                        <input type="submit" class="btn btn-warning btn-lg btn-block" value="Envoyer"/>
                    </form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>

        <!-- FOOTER --> 
        <div id="footer-row" class="content-row colored-row row">
            <div class="text-center row">
                <img class="logo-paces-store-footer" src="img/Logo-PACES-Store.png" alt="PACES Store">
            </div>
            <div class="text-center row">
                <a href="https://www.facebook.com/Reussirmapaces.fr" target="_blank" class="footer-social-link"><span class="fa fa-facebook fa-lg"></span></a>
                <a href="https://twitter.com/ReussirmaPACES"  target="_blank" class="footer-social-link"><span class="fa fa-twitter fa-lg"></span></a>
                <a href="https://plus.google.com/u/0/108208639336250490854/posts"  target="_blank" class="footer-social-link"><span class="fa fa-google-plus fa-lg"></span></a>
            </div>
        </div>
    </body>
</html>

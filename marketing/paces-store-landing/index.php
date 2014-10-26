<?php
session_start();
$actionSubmitted = 0;
//si c'est un formulaire QUESTION
if (isset($_POST['name']) && isset($_POST['inputmailquestion'])) {
    $file = fopen("emails.csv", "a");
    $name = htmlspecialchars($_POST['name']);
    $mail = htmlspecialchars($_POST['inputmailquestion']);
    $question = htmlspecialchars($_POST['question']);
    fputcsv($file, array("0", $mail, $name, $question), ";");
    $to = 'paxeld@gmail.com';
    $subject = '[PACES STORE] Question de ' . $name . ' ';
    $message = 'Salut <br/>'
            . $name . ' ( ' . $mail . ' ) ' . 'vient de poser une question sur PACES Store : <br/>'
            . $question . '';
    $headers = 'MIME-Version: 1.0' . "\r\n" .
            'Content-type: text/html; charset=utf-8' . "\r\n" .
            'From: question@paces-store.fr' . "\r\n" .
            'Cc: florianduport@gmail.com' . "\r\n" .
            'Bcc: adrien.dhuicq@gmail.com' . "\r\n" .
            'Reply-To: noreply@paces-store.fr' . "\r\n" .
            'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $message, $headers);
    $actionSubmitted = 1;
}
//si c'est une inscription mail
else if (isset($_POST['inputmail'])) {
    if ($_POST['inputmail'] == "") {
        $actionSubmitted = 3;
    } else {
        $file = fopen("emails.csv", "a");
        fputcsv($file, array($_POST['check-box-vendeur'] == "" ? 0 : 1, $_POST['inputmail']), ";");
        $actionSubmitted = 2;
    }
}
?>

<!DOCTYPE html>
<html>
    <head>
        <title>PACES Store</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:locale" content="fr_FR">
        <meta property="og:title" content="PACES Store" />
        <meta property="og:description" content="Découvrez une toute nouvelle façon de travailler. La première plateforme de travail par et pour les étudiants." />
        <meta name="description" content="PACES Store : Découvrez une toute nouvelle façon de travailler. La première plateforme de travail par et pour les étudiants." />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
        <link rel="stylesheet" href="css/font-awesome.min.css">
        <link rel="stylesheet" href="css/override.css">
        <link rel="stylesheet" href="css/animate.css">
        <link rel="icon" href="img/PACES-STORE-ICO.ico" />
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script type="text/javascript" src="js/ketchup.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/animate.js"></script>
        <script type="text/javascript" src="js/overlayer.js"></script>
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

            //Tracking
            $(document).ready(function () {
                $("#signup-top").click(function () {
                    ga('send', 'event', 'LandingPage', 'Click', 'SignupTop');
                });
                $("#signup-bottom").click(function () {
                    ga('send', 'event', 'LandingPage', 'Click', 'SignupBottom');
                });
                $("#signup-contact").click(function () {
                    ga('send', 'event', 'LandingPage', 'Click', 'SignupContact');
                });
            });

        </script>
        <meta name="google-site-verification" content="hIfrtfmDJXM5vy7BkFSyYpxPlUFfVLp2F8jcbcMztls" />
    </head>
    <body>
        <?php if ($actionSubmitted != 0) { ?>
            <div id="message-box">
                <div class="row">
                    <div class="col-xs-3"></div>
                    <div class="col-xs-6" id="message-box-content">
                        <i class="close fa fa-close fa-lg"></i>
                        <div class="row">
                            <div class="col-xs-1"></div>
                            <div class="col-xs-10 text-center">
                                <img class="logo-paces-store-popin img-responsive text-center" src="img/Logo-PACES-Store-noir.png" alt="PACES Store"/>
                                <br/>
                                <?php if ($actionSubmitted != 3) { ?>
                                    <div class="alert alert-success" role="alert">
                                        <strong>Merci !</strong> 
                                        <?php if ($actionSubmitted == 1) { ?>
                                            <span>Votre question a bien été prise en compte. Nous vous répondrons dans les plus bref délais.</span>
                                        <?php } else if ($actionSubmitted == 2) { ?>
                                            <span>Votre inscription est bien prise en compte !</span><br/>
                                            <span>Préparez-vous à être tenu au courant des toutes dernières avancées de PACES Store.</span>
                                        <?php } ?>
                                    </div>
                                    <p id="message-box-share-text" class="text-center">Partagez PACES Store autour de vous :</p>
                                    <div class="fb-share-button" data-href="http://www.paces-store.fr" data-width="200"></div>
                                    <a href="https://twitter.com/share" class="twitter-share-button" data-url="http://www.paces-store.fr" data-text="Découvrez PACES-Store !" data-lang="fr" data-count="none" data-hashtags="PACES-Store">Tweeter</a>
                                <?php } else if ($actionSubmitted == 3) { ?>
                                    <div class="alert alert-danger" role="alert">
                                        <strong>Oups ! une erreur est survenue.</strong>
                                        <span>Merci de renseigner à nouveau votre mail.</span><br/>
                                        <span>Si le problème persiste, utilisez le formulaire de contact.</span>
                                    </div>
                                <?php } ?>
                            </div>
                            <div class="col-xs-1"></div>
                        </div>
                    </div>
                    <div class="col-xs-3"></div>
                </div>
            </div>
            <div id="overlayer">
                <!-- -->
            </div> 
        <?php } ?>
        <div id="home" class="section dark transparent text-center row">
            <div class="section-inner col-xs-12">
                <div class="row">
                    <div class="col-xs-1"></div>
                    <div class="col-xs-10">
                        <h1>Découvrez une toute nouvelle façon de travailler</h1>
                    </div>
                    <div class="col-xs-1"></div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <img class="logo-paces-store img-responsive" src="img/Logo-PACES-Store.png" alt="PACES Store"/>
                    </div>
                </div>
                <div class="row">
                    <div class="col-xs-12">
                        <p class="p-logo-rmp text-center col-xs-12 img-responsive">
                            Par <img class="logo-rmp" src="img/Logo-RMP-PACES-STORE.png" alt="PACES Store"/>
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- SIGNUP ! -->
        <div class="signup-row colored-row row">
            <div class="col-xs-12">
                <form class='form-inline newsletter-form' id="signup-top-form" action="#" method="POST" role="form" name="form-mail">
                    <div class="row text-center">
                        <div class="col-xs-12">
                            <div class="row">
                                <div class="col-xs-12">
                                    <h3>Intéressé(e) et envie d’en savoir encore plus ?</h3>
                                    <br/>
                                </div>
                            </div>
                            <div class="row">
                                <input type='email' class="form-control input-lg" id="inputmail" name="inputmail" placeholder="Mon adresse mail" required/>
                                <input type='submit' id="signup-top" class="btn btn-lg btn-warning" value="Je suis intéressé(e)">
                            </div>
                        </div>
                    </div>
                    <div class="row box-vendeur">
                        <div class="col-xs-12">
                            <input type='checkbox' class="checkbox-inline" name="check-box-vendeur" value='1' id="check-box-vendeur"> 
                            <label for="check-box-vendeur" class="control-label">J'ai réussi ma PACES et souhaite proposer mes contenus</label>
                        </div>
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
                            <div id="lightbulb" class="col-xs-2">
                                <img src="img/rocket70.png" alt="nice idea" class="img-responsive"/>
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
            <div class="col-xs-12">
                    <h3 class="text-center">Aussi simple que bonjour</h3>
                    <p class="text-center">
                        <img id="schema" src="img/PACES-Store-schema.png"/>
                    </p>
            </div>
        </div>

        <!-- CONTENT ROW 4 -->
        <div id="content-row-4" class="content-row alter-colored-row row visibility-hidden">
            <div class="col-xs-12">
                <div class="row">
                    <div class="col-xs-2"></div>
                    <div class="col-xs-8">
                        <h3 class="text-center" id="qui-sommes-nous">Qui sommes-nous ?</h3>
                        <p class="text-center">Elaboré avec <i class="fa fa-heart"></i> par l'équipe de référence en PACES :</p>
                        <p class="p-logo-rmp text-center"><img class="logo-rmp logo-rmp-colored" src="img/Logo-RMP-PACES-STORE-COLORED.png" alt="PACES Store"/></p>
                    </div>
                    <div class="col-xs-2"></div>
                </div>
            </div>
        </div>


        <!-- SIGNUP ! -->
        <div class="signup-row colored-row row">
            <div class="col-xs-12">
                <form class='form-inline newsletter-form' id="signup-bottom-form" action="#" method="POST" role="form" name="form-mail-bottom">
                    <div class="row text-center">
                        <h3>Intéressé(e) et envie d’en savoir encore plus ?</h3>
                        <br/>
                        <input type='email' class="form-control input-lg" id="inputmail" name="inputmail" placeholder="Mon adresse mail" required/>
                        <input type='submit' id="signup-bottom" class="btn btn-lg btn-warning" value="Je suis intéressé(e)">
                    </div>
                    <div class="row box-vendeur">
                        <div class="col-xs-12">
                            <input type='checkbox' name="check-box-vendeur" class="checkbox-inline" value='1' id="check-box-vendeur-bottom"> 
                            <label for="check-box-vendeur-bottom" class="control-label">J'ai réussi ma PACES et souhaite proposer mes contenus</label>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <!-- CONTACT US -->
        <div id="contact-row" class="content-row row">
            <div class="col-xs-12">
                <h3>Une question ? On est là pour ça <i class="fa fa-smile-o"></i></h3>
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <form name="contact-form" id="signup-contact-form" role="form" action="#" method="POST" name="form-question">
                        <div class="form-group row">
                            <div class="col-md-6">
                                <input type="text" class="form-control" name="name" placeholder="Mon nom et prénom" required/>
                            </div>
                            <div class="col-md-6">
                                <input type="email" class="form-control" name="inputmailquestion" placeholder="Mon adresse mail" required />
                            </div>
                        </div>
                        <div class="form-group">
                            <textarea class="form-control" name="question" rows="8" placeholder="Ma question" required></textarea>
                        </div>
                        <input type="submit" id="signup-contact" class="btn btn-warning btn-lg btn-block" value="Envoyer"/>
                    </form>
                </div>
                <div class="col-md-3"></div>
            </div>
        </div>

        <!-- FOOTER --> 
        <div id="footer-row" class="content-row colored-row row">
            <div class="text-center row">
                <img class="logo-paces-store-footer img-responsive" src="img/Logo-PACES-Store.png" alt="PACES Store">
            </div>
            <div class="text-center row">
                <a href="https://www.facebook.com/Reussirmapaces.fr" target="_blank" class="footer-social-link"><span class="fa fa-facebook fa-lg"></span></a>
                <a href="https://twitter.com/ReussirmaPACES"  target="_blank" class="footer-social-link"><span class="fa fa-twitter fa-lg"></span></a>
                <a href="https://plus.google.com/u/0/108208639336250490854/posts"  target="_blank" class="footer-social-link"><span class="fa fa-google-plus fa-lg"></span></a>
            </div>
        </div>

        <div id="fb-root"></div>
        <!-- FACEBOOK --> 
        <script>
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id))
                    return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&appId=1509404119329099&version=v2.0";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        </script>
        <!-- TWITTER -->
        <script>!function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0], p = /^http:/.test(d.location) ? 'http' : 'https';
                if (!d.getElementById(id)) {
                    js = d.createElement(s);
                    js.id = id;
                    js.src = p + '://platform.twitter.com/widgets.js';
                    fjs.parentNode.insertBefore(js, fjs);
                }
            }(document, 'script', 'twitter-wjs');</script>

    </body>
</html>
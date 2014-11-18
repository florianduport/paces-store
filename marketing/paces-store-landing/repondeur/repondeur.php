
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
        <link rel="stylesheet" href="http://www.paces-store.fr/landing/css/font-awesome.min.css">
        <link rel="stylesheet" href="http://www.paces-store.fr/landing/css/override.css">
        <link rel="stylesheet" href="http://www.paces-store.fr/landing/css/animate.css">
        <link rel="icon" href="http://www.paces-store.fr/landing/img/PACES-STORE-ICO.ico" />
        <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
        <script type="text/javascript" src="http://www.paces-store.fr/landing/js/ketchup.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="http://www.paces-store.fr/landing/js/animate.js"></script>
        <script type="text/javascript" src="http://www.paces-store.fr/landing/js/overlayer.js"></script>
        <script type="text/javascript" src="http://www.paces-store.fr/landing/js/flowtype.js"></script>
        <script type="text/javascript" src="http://www.paces-store.fr/landing/js/bootbox.min.js"></script>
        <script src="//tinymce.cachefly.net/4.0/tinymce.min.js"></script>
        <link href='http://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300ita‌​lic,400italic,500,500italic,700,700italic,900italic,900' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div class="container-fluid">
            <?php
            if (isset($_POST['mail']) && $_POST['mail'] != '') {
                $to = $_POST['mail'];
                $subject = $_POST['subject'];
                $message = $_POST['message'];
                $headers = 'MIME-Version: 1.0' . "\r\n" .
                        'Content-type: text/html; charset=utf-8' . "\r\n" .
                        'From: contact@paces-store.fr' . "\r\n" .
                        'Cc: paxeld@gmail.com' . "\r\n" .
                        'Bcc: florianduport@gmail.com; adrien.dhuicq@gmail.com' . "\r\n" .
                        'Reply-To: contact@paces-store.fr' . "\r\n" .
                        'X-Mailer: PHP/' . phpversion();
                //mail($to, $subject, $message, $headers);
            }
            ?>
            <h1></h1>
            <form class="form-horizontal" class="form-horizontal" action="#" method="POST">
                <fieldset>
                    <!-- Form Name -->
                    <legend>Le répondeur de PACES Store</legend>

                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="mail">Email</label>  
                        <div class="col-md-4">
                            <input id="mail" name="mail" placeholder="Recepteur" class="form-control input-md" required="" type="mail">
                            <span class="help-block">Ici c'est le mail du poseur de question, poulet</span>  
                        </div>
                    </div>
                    <!-- Text input-->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="subject">Objet du mail</label>  
                        <div class="col-md-4">
                            <input id="subject" name="subject" class="form-control input-md" required="" type="text" value="[PACES Store] Réponse à votre question">
                            <span class="help-block">Ici tu personnalises ou non l'objet du mail</span>  
                        </div>
                    </div>
                    <!-- Textarea -->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="message">Corp du message</label>
                        <div class="col-md-4">                     
                            <textarea class="form-control" id="message" name="message">Bonjour <br/>
 <br/>
 <br/>
Cordialement, <br/>
L'équipe PACES Store</textarea>
                        </div>
                    </div>

                    <!-- Button -->
                    <div class="form-group">
                        <label class="col-md-4 control-label" for="send"></label>
                        <div class="col-md-4 text-center">
                            <input type="submit" id="send" name="send" class="btn-lg btn-success" value="Envoyer"/>
                        </div>
                    </div>

                </fieldset>
            </form>
        </div>
        <script>tinymce.init({selector:'textarea'});</script>
        <script>
            $('document').on("click", "#send", function (e) {
                bootbox.confirm("On l'envoie ce mail ?", function (result) {
                    Example.show("begood " + result);
                });
            });
        </script>
    </body>
</html>

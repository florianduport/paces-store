$(document).ready(function(){
	var card = new Card({
        // a selector or DOM element for the form where users will
        // be entering their information
        form: '#checkoutForm', // *required*
        // a selector or DOM element for the container
        // where you want the card to appear
        container: '#card', // *required*


        width: 350, // optional — default 350px
        formatting: true, // optional - default true

        // Strings for translation - optional
        messages: {
            validDate: 'valid\ndate', // optional - default 'valid\nthru'
            monthYear: 'mm/yyyy', // optional - default 'month/year'
        },

        formSelectors: {
            numberInput: 'input[name=number]', // optional — default input[name="number"]
            expiryInput: 'input[name=expiry]', // optional — default input[name="expiry"]
            cvcInput: 'input[name=cvc]', // optional — default input[name="cvc"]
            nameInput: 'input[name=name]' // optional - defaults input[name="name"]
        },

        // Default values for rendered fields - optional
        values: {
            number: '•••• •••• •••• ••••',
            name: 'NOM COMPLET',
            expiry: 'MM/AA',
            cvc: '•••'
        },

        // if true, will log helpful messages for setting up Card
        debug: false // optional - default false
    });
    $("#backToSignIn").click(function(){
        $.get("/signout", function (data) {
            window.location.reload();
        });
    });
});	
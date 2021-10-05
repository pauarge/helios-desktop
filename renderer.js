document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('election_initiator');
    form.onsubmit = submit;

    function submit(event) {
        // For this example, don't actually submit the form
        event.preventDefault();

        const value = document.getElementById('election_url').value;
        window.location.replace("heliosbooth/vote.html?election_url=" + value);
    }
});

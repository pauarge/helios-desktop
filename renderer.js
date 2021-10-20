document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('election_initiator');
    form.onsubmit = submit;

    function submit(event) {
        // For this example, don't actually submit the form
        event.preventDefault();

        const value = document.getElementById('election_url').value;

        const voter_id = document.getElementById('voter_id').value;
        const voter_password = document.getElementById('voter_password').value;

        localStorage.setItem('voter_id', voter_id);
        localStorage.setItem('voter_password', voter_password);

        window.location.replace("heliosbooth/vote.html?election_url=" + value);
    }
});

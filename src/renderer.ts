document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('election_initiator');
    form.onsubmit = submit;

    function submit(event: Event) {
        event.preventDefault();

        const election_url: string = (document.getElementById('election_url') as HTMLInputElement).value;
        const voter_id: string = (document.getElementById('voter_id') as HTMLInputElement).value;
        const voter_password: string = (document.getElementById('voter_password') as HTMLInputElement).value;

        localStorage.setItem('voter_id', voter_id);
        localStorage.setItem('voter_password', voter_password);

        window.location.replace(`heliosbooth/vote.html?election_url=${election_url}`);
    }
});

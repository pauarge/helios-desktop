const parseElectionURL = (rawUrl: string): string => {
    if (rawUrl.endsWith('/')) {
        return rawUrl.slice(0, -1);
    }
    return rawUrl;
}

document.addEventListener("DOMContentLoaded", function() {
    localStorage.clear();

    const form = document.getElementById('election_initiator');
    form.onsubmit = submit;

    function submit(event: Event) {
        event.preventDefault();

        const raw_election_url: string = (document.getElementById('election_url') as HTMLInputElement).value;
        const election_url: string = parseElectionURL(raw_election_url);

        const voter_id: string = (document.getElementById('voter_id') as HTMLInputElement).value;
        const voter_password: string = (document.getElementById('voter_password') as HTMLInputElement).value;

        localStorage.setItem('voter_id', voter_id);
        localStorage.setItem('voter_password', voter_password);

        window.location.replace(`heliosbooth/vote.html?election_url=${election_url}`);
    }
});

const electron = window.require('electron');
const ipcRenderer  = electron.ipcRenderer;

const parseElectionURL = (rawUrl: string): string => {
    if (rawUrl.endsWith('/')) {
        return rawUrl.slice(0, -1);
    }
    return rawUrl;
}

document.addEventListener("DOMContentLoaded", function() {
    window.localStorage.clear();

    const form = document.getElementById('election_initiator');
    form.onsubmit = submit;

    function submit(event: Event) {
        event.preventDefault();

        const election_url: string = (document.getElementById('election_url') as HTMLInputElement).value;
        const target: string = parseElectionURL(election_url);

        const voter_id: string = (document.getElementById('voter_id') as HTMLInputElement).value;
        const voter_password: string = (document.getElementById('voter_password') as HTMLInputElement).value;

        ipcRenderer.send('store-data', {
            target,
            voter_id,
            voter_password,
        });
    }
});

ipcRenderer.on('redirect', () => {
    window.location.replace(`heliosbooth/vote.html`);
});

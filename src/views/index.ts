import { EVENT_PROXY_KILL, EVENT_STORE_DATA } from '../constants';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const parseElectionURL = (rawUrl: string): string => {
	if (rawUrl.endsWith('/')) {
		return rawUrl.slice(0, -1);
	}
	return rawUrl;
};

document.addEventListener('DOMContentLoaded', function () {
	ipcRenderer.send(EVENT_PROXY_KILL);

	const form = document.getElementById('election_initiator');
	form.onsubmit = (event: Event) => {
		event.preventDefault();

		const electionUrl: string = (
			document.getElementById('election_url') as HTMLInputElement
		).value;
		const target: string = parseElectionURL(electionUrl);

		const voterId: string = (
			document.getElementById('voter_id') as HTMLInputElement
		).value;
		const voterPassword: string = (
			document.getElementById('voter_password') as HTMLInputElement
		).value;

		ipcRenderer.send(EVENT_STORE_DATA, {
			target,
			voterId,
			voterPassword,
		});
	};
});

ipcRenderer.on('redirect', () => {
	window.location.replace(`heliosbooth/vote.html`);
});

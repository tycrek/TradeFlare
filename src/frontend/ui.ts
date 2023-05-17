import { Elements } from './elements';

// * New user flow
// Open the new user dialog
Elements.NewUser.newButton.addEventListener('click', (event) => (Elements.NewUser.newDialog as any).show());

// Attempts to register the user
Elements.NewUser.registerButton.addEventListener('click', (event) => {

	// Get the value of the inputs
	let callSign = Elements.NewUser.callSignInput.value;
	let faction = Elements.NewUser.factionInput.value;

	// Fix faction
	if (faction == null || faction == '')
		faction = 'COSMIC';

	// Call the API
	fetch(`/api/v1/register/${callSign}/${faction}`)
		.then(res => res.json())
		.then((data: any) => {
			// ! This doesn't error handle properly yet

			// Set the primary token input
			Elements.Core.userTokenInput.value = data.data.token;

			// Set the name in the success dialog
			Elements.NewUser.successName.innerText = data.data.agent.symbol;

			// Set the agent info in the agent panel
			Elements.AgentPanel.name.innerText = data.data.agent.symbol;
			Elements.AgentPanel.accountId.innerText = data.data.agent.accountId;
			Elements.AgentPanel.location.innerText = data.data.agent.headquarters;

			(Elements.NewUser.newDialog as any).hide();
			(Elements.NewUser.successDialog as any).show();
		})
		.catch(err => console.error(err));
});

Elements.NewUser.copyNewTokenButton.addEventListener('click', (event) => {
	navigator.clipboard.writeText(Elements.Core.userTokenInput.value)
		.then(() => Elements.NewUser.copyNewTokenButton.innerHTML = 'Copied!')
		.catch((err) => (console.error(err), alert('An error occurred, see console for details')));
});


// * Sign in flow
Elements.Core.userTokenInput.addEventListener('sl-input', (event) => {
	// Get the value of the input
	console.log(`Token: ${(event.target as HTMLInputElement).value}`);

	fetch(`/api/v1/signin/${Elements.Core.userTokenInput.value}`)
		.then(res => res.json())
		.then((data: any) => {
			console.log(data);
			Elements.AgentPanel.name.innerText = data.data.symbol;
			Elements.AgentPanel.accountId.innerText = data.data.accountId;
			Elements.AgentPanel.location.innerText = data.data.headquarters;
		})
		.catch(err => console.error(err));
});

